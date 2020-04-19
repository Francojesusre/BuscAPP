
navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { exact: "environment" } } }).then((stream)=>{console.log(stream)
    
    let video = document.getElementById('video')

    video.srcObject = stream

    video.onloadedmetadata = (ev)=>video.onplay()
    
  }).catch((err)=>console.log(err))