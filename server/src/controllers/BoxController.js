const Tea = require("../models/Tea");
const Box = require("../models/Box");

const {validationResult} = require('express-validator');
const config = require('config');
const jwt = require('jsonwebtoken');

class BoxController {

    async createBox(req, res) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({message: `Некорректный запрос`, errors})
            }
            
            const { data } = req.body;
            const newBox = new Box({...data});

            await newBox.save()
            return res.json(newBox)
        } catch (e) {
            console.log(e)
            return res.status(400).json(e)
        }
    }

    async updateBox(req, res) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({message: `Некорректный запрос`, errors})
            }
            
            const { boxHash, data } = req.body;
            const box = await Box.updateOne({ hash: boxHash }, { $set: { ...data } });
            if(!box.modifiedCount){
                return res.status(400).json({message: `Ученик не найден`})
            }
            
            return res.json(box);
        } catch (e) {
            console.log(e)
            return res.status(400).json(e)
        }
    }

    async getBox(req, res) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({error: `Некорректный запрос`, errors})
            }
            
            const { name } = req.query;
            const box = await Box.findOne({name});
            
            if(!box){
                return res.status(400).json({error: `Набоор не найден`})
            }
            
            return res.json(box)
        } catch (e) {
            console.log(e)
            return res.status(400).json(e)
        }
    }

    async getAllBoxes(req, res) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({message: `Некорректный запрос`, errors})
            }
            
            const { field, value, limit } = req.query;
            let data = {};
            if(field && value){
                data[field] = value;
            }
            const boxes = limit ? await Box.find(data).limit(limit) : await Box.find(data);
            
            
            if(!boxes){
                return res.status(400).json({message: `Отсутствуют ученики по Вашему запросу`})
            }
            
            return res.json(boxes)
        } catch (e) {
            console.log(e)
            return res.status(400).json(e)
        }
    }

    async reserveBox(req, res) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({message: `Некорректный запрос`, errors})
            }
            
            const { boxData, userData } = req.body;
            const box = await Box.findOne({ hash: boxData.hash });
            const allTeas = await box.teas.map(tea => {
                const reservedTea = Tea.findOne({name: tea.name});
                if(!reservedTea){
                    throw new Error('Ошибка! Набор составлен некорректно, обратитесь к администратору.');
                }
                //tea = { userId: "usr12345", weight: 120, timestamp: "10.10.20T18:30:15" };
                const totalReservedWeight = reservedTea.reserve.reduce((sum, current) => current.weight + sum, 0);
            
                const existTea = (reservedTea.total - (totalReservedWeight + tea.weight) + reservedTea.limit) > 0 
                return existTea ? {...tea, exist: existTea, reserve: reservedTea} : {...tea, exist: existTea, error: 'Недостаточного чая'};
            });

            if(allTeas.every(tea => tea.exist)){
                allTeas.map((tea) => {
                    const reservedTea = Tea.findOne({name: tea.name});
                });
            } 

            if(!Box.modifiedCount){
                return res.status(400).json({message: `Ученик не найден`})
            }
            
            return res.json(Box)
        } catch (e) {
            console.log(e)
            return res.status(400).json(e)
        }
    }

    async deleteBox(req, res) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({message: `Некорректный запрос`, errors})
            }
            
            const { BoxHash } = req.body;
            const Box = await Box.deleteOne({ hash: BoxHash });
            if(!Box.deletedCount){
                return res.status(400).json({ message: `Не удалось удалить` })
            }
            
            return res.json(Box)
        } catch (e) {
            console.log(e)
            return res.status(400).json(e)
        }
    }


}

module.exports = new BoxController()