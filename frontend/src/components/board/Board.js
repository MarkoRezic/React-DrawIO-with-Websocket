import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client';

import './style.css';

export const Board = (props) => {
    const [color, setColor] = useState("#000000")
    const [size, setSize] = useState(5)
    const [canvasImage, setCanvasImage] = useState(null)
    const canvasRef = useRef(null)
    const penRef = useRef(null)
    const listenersRef = useRef({
        updateMousePosition: null,
        onMouseDown: null,
        onMouseUp: null
    })

    const CANVAS_SIZE = {
        width: 800,
        height: 800
    }

    const socketRef = useRef(null)

    const [username, setUsername] = useState('')
    const [users, setUsers] = useState({})

    let throttleTimer;
    const throttle = (callback, time) => {
        if (throttleTimer) return;
        throttleTimer = true;
        setTimeout(() => {
            callback();
            throttleTimer = false;
        }, time);
    }

    const tryNTimes = (callback, time, conditionCallback, tries) => {
        console.log(tries, conditionCallback())
        if (tries <= 0) return
        if (!conditionCallback()) {
            setTimeout(() => {
                tryNTimes(callback, time, conditionCallback, tries - 1)
            }, time)
        }
        else {
            callback()
        }
    }

    const emitImage = () => {
        console.log("emit from", socketRef.current.id)
        var base64ImageData = canvasRef.current.toDataURL("image/png");
        socketRef.current.emit("canvas-data", { data: base64ImageData, id: socketRef.current.id });
    }

    const saveImage = (image) => {
        console.log("saved", socketRef.current.id)
        if (image != null) {
            setCanvasImage(image);
        }
        else {
            let image = new Image();
            image.onload = function () {
                setCanvasImage(image);
            };
            image.src = canvasRef.current.toDataURL("image/png");
        }
    }

    const receiveImage = ({ data, id }) => {
        console.log("receive from", id)
        var image = new Image();
        var ctx = canvasRef.current.getContext('2d');
        image.onload = function () {
            ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvasRef.current.width, canvasRef.current.height);
            saveImage(image)
        };
        image.src = data;
    }

    const hasSocketId = () => {
        return socketRef?.current?.id != null
    }

    useEffect(() => {
        socketRef.current = io.connect("http://localhost:5000")

        socketRef.current.on("user-joined", ({ userList, userId }) => {
            console.log(userList)
            toast(userId === socketRef.current?.id ? 'You joined' : `User joined: ${userList[userId]['username']}`);
            setUsers(userList)
        })

        tryNTimes(() => {
            socketRef.current.emit("login", {
                previousId: sessionStorage.getItem("previousId"),
                newId: socketRef.current.id,
                username: sessionStorage.getItem("username") ?? sessionStorage.getItem("previousId") ?? socketRef.current.id
            });
            sessionStorage.setItem("username", sessionStorage.getItem("username") ?? sessionStorage.getItem("previousId") ?? socketRef.current.id)
            sessionStorage.setItem("previousId", socketRef.current.id)

            setUsername(sessionStorage.getItem("username"))
        }, 500, hasSocketId, 10)
        return () => {

        }
    }, [])

    const updatePenPosition = (e) => {
        /* Move Pen Cursor */
        penRef.current.style.left = e.clientX + 'px';
        penRef.current.style.top = e.clientY + 'px';
    }

    useEffect(() => {
        if (canvasRef.current == null || penRef.current == null) return
        console.log("test")
        canvasRef.current.addEventListener('mousemove', updatePenPosition);
        return () => {
            canvasRef.current.removeEventListener('mousemove', updatePenPosition);
        }
    }, [canvasRef.current, penRef.current])

    useEffect(() => {
        if (penRef.current == null) return
        configPen();
        return () => {
        }
    }, [color, size, penRef.current])

    useEffect(() => {
        if (canvasRef.current == null) return
        //setIsConfigured(true)
        socketRef.current.on("canvas-data", receiveImage)

        configCanvas();
        window.addEventListener('resize', configCanvas, false);
        return () => {
            window.removeEventListener('resize', configCanvas, false);
        }
    }, [canvasRef.current])

    useEffect(() => {
        if (canvasImage == null || canvasRef.current == null) return

        var ctx = canvasRef.current.getContext('2d');
        ctx.drawImage(canvasImage, 0, 0, canvasImage.width, canvasImage.height, 0, 0, canvasRef.current.width, canvasRef.current.height);
        return () => {

        }
    }, [canvasImage, canvasRef.current])

    const configPen = () => {
        var ctx = canvasRef.current.getContext('2d');

        /* Configure Pen Stroke */
        ctx.strokeStyle = color;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = size;

        var container = document.querySelector('#board-container');
        let scale = 1;

        if (container != null) {
            let { width: ww, height: wh } = container.getBoundingClientRect();
            scale = ww / CANVAS_SIZE.width;
        }

        penRef.current.style.width = scale * size + 'px'
        penRef.current.style.height = scale * size + 'px'
    }

    const configCanvasSize = () => {
        var container = document.querySelector('#board-container');

        if (container == null || canvasRef.current == null) return
        // Get the scaled content, and reset its scaling for an instant
        canvasRef.current.style.transform = 'scale(1, 1)';

        //let { width: cw, height: ch } = canvasRef.current.getBoundingClientRect();
        let { width: ww, height: wh } = container.getBoundingClientRect();

        let scaleAmtX = ww / CANVAS_SIZE.width;
        //let scaleAmtY = wh / ch;

        canvasRef.current.style.transform = `scale(${scaleAmtX}, ${scaleAmtX})`;
        console.log("CANVAS SIZE", scaleAmtX)

        return scaleAmtX
        //canvasRef.current.width = canvasRef.current.style.width
        //canvasRef.current.height = canvasRef.current.style.height
    }

    const configCanvas = () => {
        console.log("CONFIG")

        const scale = configCanvasSize()

        const scaleMousePosition = (position) => {
            return position * (1 / scale)
        }

        const onPaint = () => {
            ctx.beginPath();
            //console.log(canvasScale, last_mouse.x, scaleMousePosition(last_mouse.x))
            ctx.moveTo(scaleMousePosition(last_mouse.x), scaleMousePosition(last_mouse.y));
            ctx.lineTo(scaleMousePosition(mouse.x), scaleMousePosition(mouse.y));
            ctx.closePath();
            ctx.stroke();

            throttle(emitImage, 1000);
        };

        const onMouseDown = () => {
            canvasRef.current.addEventListener('mousemove', onPaint, false);
        }

        const onMouseUp = () => {
            canvasRef.current.removeEventListener('mousemove', onPaint, false);
            saveImage()
        }

        var ctx = canvasRef.current.getContext('2d');

        var mouse = { x: 0, y: 0 };
        var last_mouse = { x: 0, y: 0 };

        const updateMousePosition = (e) => {
            last_mouse.x = mouse.x;
            last_mouse.y = mouse.y;

            mouse.x = e.pageX - e.target.offsetLeft;
            mouse.y = e.pageY - e.target.offsetTop;
        }


        /* Replace Canvas With Deep Clone (Removes Event Listeners) */
        //var canvas = document.querySelector('#board');
        //canvas.replaceWith(canvas.cloneNode(true));
        //canvasRef.current = canvas


        /* Remove previous listeners */
        if (listenersRef.current.updateMousePosition != null) {
            canvasRef.current.removeEventListener('mousemove', listenersRef.current.updateMousePosition, false);

            canvasRef.current.removeEventListener('mousedown', listenersRef.current.onMouseDown, false);

            canvasRef.current.removeEventListener('mouseup', listenersRef.current.onMouseUp, false);
        }

        listenersRef.current = {
            updateMousePosition,
            onMouseDown,
            onMouseUp
        }

        /* Mouse Capturing Work */
        canvasRef.current.addEventListener('mousemove', listenersRef.current.updateMousePosition, false);

        canvasRef.current.addEventListener('mousedown', listenersRef.current.onMouseDown, false);

        canvasRef.current.addEventListener('mouseup', listenersRef.current.onMouseUp, false);
    }

    const changeUsername = () => {

    }

    return (
        <div className="container">
            <div class="tools-section">
                <div className="color-picker-container">
                    Boja Olovke: &nbsp;
                    <input type="color" value={color} onChange={(e) => { setColor(e.target.value) }} />
                </div>
                <div className="brushsize-container">
                    Veličina Olovke: &nbsp;
                    <input type='range' value={size} onChange={(e) => { setSize(e.target.value) }} min={1} max={100} />
                </div>
            </div>

            <div className='row'>
                <div id='user-list'>
                    <p id='user-list-header'>Igrači</p>
                    {
                        Object.entries(users).map(([userId, user]) =>
                            <div className={'user-row' + (userId === socketRef?.current?.id ? ' current-user' : '')} key={userId}>
                                <p>{user?.username}</p>
                            </div>
                        )
                    }
                </div>
                <div id="board-container">
                    <canvas ref={canvasRef} id="board" width={800} height={800}></canvas>

                    <div ref={penRef} id='pen-cursor'></div>
                </div>
                <div id='chat'>
                    <p id='chat-header'>Chat</p>
                </div>
            </div>

            <ToastContainer
                position="bottom-center"
                autoClose={3000}
                limit={3}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme="dark"
            />
        </div>
    )
}