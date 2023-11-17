export const dataURLToFile = (dataURL, fileName) => {
    const arr = dataURL.split(",");
    const mine = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const uint8Arr = new Uint8Array(n);

    while(n--)
        uint8Arr[n] = bstr.charCodeAt(n);

    return new File([uint8Arr], fileName, { type: mine });
}