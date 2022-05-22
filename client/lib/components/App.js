import React, { useState } from 'react';
import axios from 'axios';
import { Group, Center, Button } from '@mantine/core';
import { FileUpload, CloudUpload, Upload, X } from 'tabler-icons-react';
import { Dropzone } from '@mantine/dropzone';

const SERVER = "SERVER_IP_ADDRESS";

function isASCII(s) {

    for (let char of s) {
        if (char.charCodeAt(0) >= 256) {
            return false;
        }
    }

    return true;
}

function getIconColor(status) {
  return status.accepted ? "#85C1E9" : status.rejected ? "#E74C3C" : "gray";
}

function ImageUploadIcon(props) {

    if (props.status.accepted) {
        return <Upload style={props.style} size={props.size} />;
    }

    if (props.status.rejected) {
        return <X style={props.style} size={props.size} />;
    }

    return <FileUpload style={props.style} size={props.size} />;
}

function dropzoneChildren(status) {
    return (
        <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: 'none' }}>
            <ImageUploadIcon status={status} style={{ color: getIconColor(status) }} size={80} />

            <div>
                <p style={{fontSize: "1.5em", fontWeight: "bold"}}>
                Upload
                </p>
                <p style={{fontSize: ".75em", color: "gray"}}>
                max 500MB
                </p>
            </div>
        </Group>
    );
}

function sendFile(files, sent, loading) {

    const file = files[0];
    const name = file.name;

    if (name.length > 128 || !isASCII(name)) {
        
        // ERROR MESSAGE

        return; 
    }

    loading(true);

    axios({
        method: 'post',
        url: `http://${SERVER}/api/upload/${name}`,
        headers: {
            'Content-Type': 'application/octet-stream',
        },
        data: file
    })
    .then(res => {
        sent(res.data);
    });
}

function DropArea(props) {
  
    const [state, setState] = useState(false);

    return (
        <>
            <Center style={{flexGrow: 1}}>
                <Dropzone loading={state.loading}
                    onDrop={(files) => sendFile(files, props.onSent, setState)}
                    maxSize={500 * 1024 ** 2}
                    style={{width: "50%"}}
                    multiple={false}
                >
                    {(status) => dropzoneChildren(status)}
                </Dropzone>
            </Center>
        </>
    );
}

function Title() {

    return (
        <Group position="center">
            <CloudUpload size={128} color={"#87CEEB"} />
            <h1 style={{color: "#87CEEB", fontSize: "64px"}}> Cloudy </h1>
        </Group>
    );

}

function Message(props) {

    return (
        <Center style={{flexDirection: "column", flexGrow: 1}}>
            <p>Your file has been successfully uploaded on server and you can find it under this link: <a href={`http://${SERVER}/api/download/${props.id}`}>{`${SERVER}/api/download/${props.id}`}</a> </p>
            
            <Center>
                <Button style={{marginTop: "15px"}} onClick={() => props.onClick({id: false})}>Upload again</Button>
            </Center>
        </Center>
    );

}

function App(props) {

    const [state, setState] = useState({id: false});

    return (
        <div style={{flexDirection: "column", display: "flex", flexGrow: 1}}>
            <Title />
            {
                !state.id ?
                <DropArea 
                    onSent = {setState}
                /> :
                <Message 
                    onClick = {setState}
                    id = {state.id}
                />
            }
        </div>
    );
}

export default App;