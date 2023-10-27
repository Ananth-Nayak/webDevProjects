const hrHand=document.querySelector(".hour");
const minHand=document.querySelector(".minute");
const secHand=document.querySelector(".second");

function clockRun(){
    const curDate=new Date();
    setTimeout(clockRun,1000);
   const hour=curDate.getHours();
   const minute=curDate.getMinutes();
   const second=curDate.getSeconds();
   const hourDeg=(hour/12)*360;
   console.log(hour/12);
   hrHand.style.transform=`rotate(${hourDeg}deg)`;
   const minDeg=(minute/60)*360;
   minHand.style.transform=`rotate(${minDeg}deg)`;
   const secDeg=(second/60)*360;
   secHand.style.transform=`rotate(${secDeg}deg)`;
   
   
}

 clockRun();
