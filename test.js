
const tokengen =(tokenlength)=>{
    let tokenstr =  typeof tokenlength === 'number' && tokenlength > 0
   ? tokenlength : false

   if (tokenstr) {
       const tokenkey = 'abcdefghijklmnopqrstuvxyz0124356789';
       let output = ''
       for (let i = 1; i <=tokenstr; i++) {
          let token = tokenkey.charAt(Math.floor(Math.random() * tokenkey.length))
          output += token;
           
       }
       return output
   }
   else {return false}

}


console.log( tokengen(20));
