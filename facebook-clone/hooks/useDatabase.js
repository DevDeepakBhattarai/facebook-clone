const {createPool}=require('mysql2');
const connection=createPool(
{
host:'localhost',
user:'root',
database:'facebook',
password:'Deepak',

}
)
  export const useDatabase=(SQL)=>{
    let Result,Field;
    connection.query(SQL,
        (error,result,field)=>{
        if(error){
            console.log(error);
        }
        console.log(result);
        Result=result;
        Field=field;
    })
    return{Result,Field};
  }