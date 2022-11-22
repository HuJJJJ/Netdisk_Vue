
import axios from "axios";
import store from "../store/index";
import { BaseURL } from "../network/request";
// 下载文件方法


export async function DownLoadFile(Id,fileName) {

    var res = await axios.post(
        BaseURL + "/File/Download",
        { FileId: Id },
        {
            responseType: "blob",
            headers: {
                Authorization: `Bearer ${store.state.token}`,
    
            },
        },
      
        
    );
    const blob = new Blob([res.data]);

    if ("download" in document.createElement("a")) {
        const link = document.createElement("a");
        link.download = fileName;
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
    } else {
        navigator.msSaveBlob(blob, fileName);
    }
}