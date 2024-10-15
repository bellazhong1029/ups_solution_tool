import deltaLogo from '../assets/delta-electronics-logo.jpg';

import { Document, Packer, Paragraph, Header, ImageRun, TextRun, Table, TableCell, TableRow, VerticalAlign, TextDirection, HeadingLevel} from 'docx';

export class ReportGenerator{
    async create(
        imageUPSPath,
        imageBatteryPath,
        itemList
    ){
        // Fetch Delta logo
        const responseDeltaLogo = await fetch(deltaLogo);
        const imageBlobDeltaLogo = await responseDeltaLogo.blob();
        const imageDeltaLogo = await imageBlobDeltaLogo.arrayBuffer();

        // Fetch the  UPS image as binary data (Blob) and then Convert Blob to ArrayBuffer for docx ImageRun
        const responseUPS = await fetch(imageUPSPath);
        const imageBlobUPS = await responseUPS.blob();
        const imageUPS = await imageBlobUPS.arrayBuffer();

        //Fetch the  UPS image as binary data (Blob) and then Convert Blob to ArrayBuffer for docx ImageRun
        const responseBattery = await fetch(imageBatteryPath);
        const imageBlobBattery = await responseBattery.blob();
        const imageBattery = await imageBlobBattery.arrayBuffer();

        const report = new Document({
            sections: [
                {
                    properties: {},
                    headers: {
                        default: this.createHeader(imageDeltaLogo)
                    },
                    children: [
                        // Date
                        this.createParagraph({text:"Date:"}),
                        // Address
                        this.createParagraph({text:"Address:"}),
                        this.newline(),
                        // Quote & Reference
                        this.createParagraph({text:"QUOTE: XXXX /YOUR REFERENCE: XXXX", isbold:true}),
                        this.newline(),

                        // Opening
                        this.createParagraph({text:"Dear customer,"}),
                        this.createParagraph({text:"In response to your enquiry, Delta is pleased to provide you the following quotation which is based on the below listed commercial conditions: "}),
                        this.newline(),

                        // Commercial conditions
                        this.createParagraph({text:"Delivery time: x weeks after receipt of order"}),
                        this.createParagraph({text:"Terms of payment: 30 days net"}),
                        this.createParagraph({text:"Terms of delivery: ex factory"}),
                        this.createParagraph({text:"Warranty period: 12 months after delivery"}),
                        this.createParagraph({text:"Validity of the order: 30 days"}),
                        this.newline(),

                        // Contact
                        this.createParagraph({text:"If you have any technical or commercial queries please do not hesitate to contact us."}),
                        this.newline(),

                        // Item table 
                        this.createTable(itemList),

                        // UPS 
                        new Paragraph({
                            pageBreakBefore: true,
                            children: [
                                new ImageRun({
                                    data: imageUPS,
                                    transformation: {width: 600,height: 900}
                                })
                            ]
                        }),
                        
                        // Battery 
                        new Paragraph({
                            pageBreakBefore: true,
                            children: [
                                new ImageRun({
                                    data: imageBattery,
                                    transformation: {width: 600,height: 900}
                                })
                            ]
                        }),
                    ]
                },
            ],
        });

        return report;
    }

    createHeader(imageData) {
        return new Header({
            children: [
                new Paragraph({
                    children: [
                        new ImageRun({
                            data: imageData,
                            transformation: {
                                width: 143.6,
                                height: 43.6,
                            },
                        }),
                    ],
                }),
            ],
        })
    }

    newline(){
        return new Paragraph({
            spacing: {before: 100, after: 100}
        })
    }

    createParagraph({text="", spacingBefore=100, spacingAfter=100, isbold=false}) {
        return new Paragraph({
            children: [
                new TextRun({text: text, size: 22, font: "Arial", bold:isbold})
            ],
            spacing: {before: spacingBefore, after: spacingAfter}
        })
    }

    createTable(itemList) {
        return new Table({
            rows: [
                new TableRow({
                    children: [
                        this.createTableCellLable("Delta No", 250),
                        this.createTableCellLable("Description", 1100),
                        this.createTableCellLable("Price (per item)(€)", 200),
                        this.createTableCellLable("Qty", 200),
                        this.createTableCellLable("Price(€)", 250)
                    ]
                }),
                ...itemList.map(item => {
                    return this.createTableRow(item)
                })
            ]
        })
    }


    createTableCellLable(text, indent) {
        return new TableCell({
            children: [
                new Paragraph({
                    children: [
                        new TextRun({text: text , size: 20, bold:true, font: "Arial"})
                    ],
                    spacing: { after: 50, before: 50},
                    indent: {left: indent, right: indent}
                })
            ],
        })
    }

    createTableRow(item) {
        return new TableRow({
            children: [
                this.createTableCellContent(item.pn),
                this.createTableCellContent(item.description),
                this.createTableCellContent(item.price.toString()),
                this.createTableCellContent(item.qty.toString()),
                this.createTableCellContent((item.price * item.qty).toString())
            ]
        })
    }

    createTableCellContent(text){
        return new TableCell({
            children: [
                new Paragraph({
                    children: [
                        new TextRun({text: text, size: 20, bold:true, font: "Arial"})
                    ]
                })
            ],
        })

    }
}

