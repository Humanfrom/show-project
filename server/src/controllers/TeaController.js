const Tea = require("../models/Tea");
const Box = require("../models/Box");

const {validationResult} = require('express-validator');
const config = require('config');
const jwt = require('jsonwebtoken');

class TeaController {
    
    async add(tea) {
        try {            
            const newTea = new Tea({...tea});
            await newTea.save()
            return newTea;
        } catch (e) {
            return e;
        }
    }
    
    async updateTeasInBoxes() {
        try {            
            const teas = await Tea.find({}, { name: 1, title: 1, class: 1});
            let boxes = await Box.find({}, { teas: 1, _id: 1 });
            console.log(boxes);

            boxes.map( async box => {
                const selectedBox = await Box.findById(box._id)
                selectedBox.teas = box.teas.map( tea => {
                    const [ teaData ] = teas.filter( item => item.name === tea.name) || [{_doc: null}]; 
                    return { ...teaData._doc };
                });
                
                console.log(selectedBox.teas);
                await selectedBox.save();
            })

            return "OK";
        } catch (e) {
            return e;
        }
    }
}

module.exports = new TeaController()