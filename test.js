
const omar={name: "omar", age: "25"}

if (omar) {
   const check = (omar)=>{
    const cehckstudy= typeof omar.data === 'object' && omar.data instanceof Array ? omar.data : []
    if (cehckstudy) {
        const checkid = "flsjljlsdlfs"
        const newdata={checkid,department:"EEE", CGPA: '3.30'}
        omar.checkstudy = cehckstudy
        omar.checkstudy.push(checkid)
    }
    console.log(omar);
    }
    check(omar)
}



