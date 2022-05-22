use actix_files::*;
use actix_cors::*;
use actix_web::{
    HttpServer,
    HttpRequest,
    App,
    post,
    get,
    http::header::*,
    web::{
        Path,
        BytesMut,
        Payload
    },
    Result as HttpResult,
    Error   
};
use futures_util::stream::StreamExt;
use rand::{*, thread_rng as rng};
use serde_json::{json};
use std::io::{Write};

#[get("/")]
async fn index(_: HttpRequest) -> Result<NamedFile, Error> {
    let file = NamedFile::open("./static/index.html")?;
    Ok(file
        .use_last_modified(true)
        .set_content_disposition(ContentDisposition {
            disposition: DispositionType::Inline,
            parameters: vec![],
        })
    )
}

#[post("/api/upload/{id}")]
async fn upload(name: Path<String>, mut body: Payload) -> HttpResult<String> {
    let mut bytes = BytesMut::new();
    while let Some(item) = body.next().await {
        bytes.extend_from_slice(&item?);
    }

    let mut rng = rng();
    let mut id = String::new();
    for _ in 0..5 {
        id.push(rng.gen_range('A'..='Z'));
    }

    let folder = format!("./download/{}", id);
    std::fs::create_dir(&folder)?;

    let mut file = std::fs::File::create(format!("./download/{}/{}", id, name))?;
    file.write_all(&bytes)?;
    file.sync_all()?;

    Ok(json!({
        "id": id
    }).to_string())
}

#[get("/api/download/{id}")]
async fn download(id: Path<String>) -> Result<NamedFile, Error> {
    let mut folder = std::fs::read_dir(format!(".\\download\\{}", id))?;
    let path = folder.next().unwrap()?.path();
    let file = NamedFile::open(&path)?;
    Ok(file
        .use_last_modified(true)
        .set_content_disposition(ContentDisposition {
            disposition: DispositionType::Attachment,
            parameters: vec![
                DispositionParam::Filename(
                    path.file_name().unwrap().to_string_lossy().into()
                )
            ],
        })
    )
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {

    HttpServer::new(|| {
        let cors = Cors::permissive();
        App::new()
        .wrap(cors)
        .service(
            Files::new("/static", "./static/")
        )
        .service(index)
        .service(upload)
        .service(download)
    })
        .bind(("192.168.0.113", 8080))?
        .run()
        .await

}