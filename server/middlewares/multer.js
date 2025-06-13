import multer from 'multer';
import {v4 as uuid} from 'uuid'; // import uuid for unique file names

const storage = multer.diskStorage({ //storage created
    destination(req,file,cb){ //destination of the file is set
        cb(null,"uploads") //call back take 2 arg error , file location
    },
    filename(req,file,cb){
      const id = uuid(); //unique id is created using uuid
      
      const extName= file.originalname.split(".").pop(); //extension of the file is taken

      const fileName = `${id}.${extName}`; //filename is created using unique id and extension name

      cb(null, fileName) //callback is called with null and filename
    }

})

export const uploadFiles = multer({storage}).single("file");