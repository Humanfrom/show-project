const bcrypt = require("bcryptjs");
const config = require("config");
const User = require("../models/User");
const winston = require("winston");
const TelegramBotController = require("../controllers/TelegramBotController");
const nodemailer = require("nodemailer");
const YandexDeliveryService = require("./delivery/YandexDeliveryService");

class DeliveryService {
  constructor() {
    this.unit_price = 0;
    this.inn = "1234567891011";
    this.package = {
      weight: 50,
      dx: 12,
      dy: 11,
      dz: 30,
      volume: 3960,
    };
    this.daysToDelivery = 2;
    this.platform_id = "fbed3aa1-2cc6-4370-ab4d-59c5cc9bb924";
  }

  prepareData(data) {
    const { service } = data;
    switch (service) {
      case "yandex":
        return this.prepareYandexData(data);
      case "RP":
        return this.prepareRPData();
      default:
        return null;
    }
  }

  prepareYandexData({ boxes, recipient, action, comment, type, uuid }) {
    if (action === "check") {
      const places = boxes.map((box) => ({
        physical_dims: {
          weight_gross: box.weight + this.package.weight,
          dx: this.package.dx,
          dy: this.package.dy,
          dz: this.package.dz,
          predefined_volume: this.package.volume,
        },
      }));

      const cost = boxes.reduce((acc, box) => acc + Number(box.cost), 0);
      const weight = boxes.reduce((acc, box) => acc + Number(box.weight), 0);

      return {
        source: {
          platform_station_id: this.platform_id,
        },
        destination: {
          address: recipient.address?.value,
        },
        tariff: type === "pvz" ? "self_pickup" : "time_interval",
        total_weight: weight,
        total_assessed_price: cost,
        client_price: 0,
        payment_method: "already_paid",
        places,
      };
    } else {
      const time = new Date().getTime();
      const { dx, dy, dz, volume } = this.package;
      const { first_name, last_name, phone } = recipient;
      const items = boxes.map((item) => ({
        count: 1,
        name: item.title,
        article: `${item.name}_${item.weight}`,
        uin: uuid,
        billing_details: {
          inn: this.inn,
          unit_price: this.unit_price,
          assessed_unit_price: item.cost,
        },
        physical_dims: { dx, dy, dz, predefined_volume: volume },
        place_barcode:
          new Date().getTime() + String(Math.round(Math.random() * 1000)),
      }));

      const places = boxes.map((item, i) => ({
        physical_dims: { dx, dy, dz, predefined_volume: volume },
        barcode: items[i].place_barcode,
        description: boxes.title,
      }));

      const cost = boxes.reduce((acc, box) => acc + Number(box.cost), 0);

      return {
        info: {
          operator_request_id: String(Math.round(Math.random() * 10000)),
          comment,
        },
        source: {
          platform_station: {
            platform_id: this.platform_id,
          },
          interval_utc: {
            from: new Date(time).toJSON(),
            to: new Date(
              time + 60 * 60 * 24 * 1000 * this.daysToDelivery
            ).toJSON(),
          },
        },
        destination: {
          type: type === "pvz" ? "platform_station" : "custom_location",
          platform_station:
            type === "pvz"
              ? {
                  platform_id: params.destination_station.id,
                }
              : null,
          custom_location:
            type === "courier"
              ? {
                  latitude: address.data.geo_lat,
                  longitude: address.data.geo_lon,
                  details: {
                    comment,
                    full_address: address.value,
                    room: address.data.flat || address.data.room,
                  },
                }
              : null,
          /*interval_utc: {
            from: "2021-10-25T15:00:0.000000Z",
            to: "2021-10-25T15:00:0.000000Z",
          },*/
        },
        items,
        places,
        billing_info: {
          payment_method: "already_paid",
          delivery_cost: 0,
        },
        recipient_info: {
          first_name,
          last_name,
          phone,
        },
        last_mile_policy: type === "pvz" ? "self_pickup" : "time_interval",
        particular_items_refuse: false,
      };
    }
  }

  prepareRPData() {
    return { error: "Что-то пошло не так." };
  }

  checkDelivery(data) {
    const { service } = data;
    const prepData = this.prepareData({ ...data, action: "check" });
    switch (service) {
      case "yandex":
        return new YandexDeliveryService().check(prepData);
      default:
        return { error: "Служба доставки не найдена" };
    }
  }

  create(data) {
    const prepData = this.prepareData({ ...data, action: "create" });
    switch (service) {
      case "yandex":
        return new YandexDeliveryService().create(prepData);
      default:
        return { error: "Служба доставки не найдена" };
    }
  }
}

module.exports = DeliveryService;
