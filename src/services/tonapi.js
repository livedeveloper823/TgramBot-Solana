const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
const fet=async(tokenAddress)=>{
  
    const response= await fetch(`https://tonapi.io/v2/address/${tokenAddress}/parse`,{method: 'GET',
    headers: {
        'accept': 'application/json','Authorization': `Bearer AGFBRU3RI63ATTAAAAABF6I5E7XSAOL5UWKGKDOZWHJBNEEFXSXERA2KWU3H4RE27C7WJKY`
  
    }}
  );
  
      data=await response.json()
      console.log(data.error)
      console.log(data)
      if (data.error=='rate limit: free tier'||data==undefined){
        await sleep(3000)
        return await fet(tokenAddress)
      }
      else{return data}
  }
  const fetJeton=async(add)=>{
    const response= await fetch(`https://tonapi.io/v2/jettons/${add}`,{method: 'GET',
    headers: {
        'accept': 'application/json','Authorization': `Bearer AGFBRU3RI63ATTAAAAABF6I5E7XSAOL5UWKGKDOZWHJBNEEFXSXERA2KWU3H4RE27C7WJKY`
  
    }})
    const data= await response.json()
    return data

  }
  
    
  module.exports={fet,fetJeton}