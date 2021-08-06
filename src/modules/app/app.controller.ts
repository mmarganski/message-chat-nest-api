import { Controller, Get, Param, Res } from '@nestjs/common'
import { fromBuffer } from 'file-type'
import { Response } from 'express'
const fs = require('fs')

@Controller('images')
export class AppController {

    @Get(':name')
    async findImage(@Param('name') name: string, @Res() response: Response) {
        try {
            const path = `${process.env.IMAGES_PATH}\\${name}`
            const image = fs.readFileSync(path)
            const fileType = await fromBuffer(image)
            console.log(fileType.mime)
            response
                .set('Content-Type', fileType?.mime)
                .send(image)
        } catch(e) {
            response.sendStatus(404)
        }
    }
}
