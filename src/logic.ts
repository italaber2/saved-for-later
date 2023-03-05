export const userAction = async () => {
  const response = await fetch('https://jsonlink.io/api/extract?url=https://gizmodo.com/european-central-bank-bitcoin-is-on-road-to-irrelevance-1849835418?utm_source=digg ', {
    method: 'GET'
  });
  const myJson = await response.json(); 
  console.log(myJson.title);
  //document.getElementById('bookmarkImg').setAttribute('src', 'data:') = myJson.images[0]
  document.getElementById('text')!.innerHTML = myJson.title
}