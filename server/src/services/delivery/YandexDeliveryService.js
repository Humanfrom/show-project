const bcrypt = require("bcryptjs");
const config = require("config");
const axios = require("axios");
const { param } = require("express-validator");

class YandexDeliveryService {
  constructor() {
    this.nearby = 0.01;
  }

  getAuth() {
    return {
      url: "https://b2b.taxi.tst.yandex.net/api/b2b/platform/",
      token: "",
    };
  }

  async check(data) {
    const { token, url } = this.getAuth();
    console.log({
      ...data,
    });

    try {
      const response = await axios.post(
        `${url}pricing-calculator`,
        {
          ...data,
        },
        {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.pricing_total) {
        const [price, currency] = response.data.pricing_total.split(" ");
        return { price: Number(price), currency };
      }

      return { error: response.data, message: "Ошибка проверки доставки" };
    } catch (error) {
      console.log(error.response?.data);
      return { error: error.response.data, message: error.response.data?.message };
    }
  }

  async create(data) {
    const { token, url } = this.getAuth();

    return data; //пока так - для тестов
    try {
      const response = await axios.post(
        `${url}pricing-calculator`,
        {
          ...data,
        },
        {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.offers) {
        const [offer] = response.data.offers; //сейчас выбирается первый попавшийся
        const request_id = await this.confirm(offer.offer_id);
        if (request_id.error) {
          throw new Error(confirmId.error);
        }

        const info = await this.getInfo(request_id);
        if(info.error || info.state.status !== 'ERROR') {
          throw new Error(info.error);
        }

        const [price, currency] = offer.pricing.split(" ");

        return { price: Number(price), currency };
      }

      return { error: response.data, message: "Ошибка проверки доставки" };
    } catch (error) {
      return { error, message: "Ошибка проверки доставки" };
    }
  }

  async confirm(offer_id) {
    const { token, url } = this.getAuth();

    try {
      const response = await axios.post(
        `${url}offers/confirm`,
        { offer_id },
        {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.request_id) {
        return { request_id: response.data };
      }

      return { error: response.data, message: "Ошибка проверки доставки" };
    } catch (error) {
      return { error, message: "Ошибка проверки доставки" };
    }
  }

  async cancel(request_id) {
    const { token, url } = this.getAuth();

    try {
      const response = await axios.post(
        `${url}request/cancel`,
        { request_id },
        {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.status && response.data.status !== "ERROR") {
        return { status: response.data.status };
      }

      return { error: response.data, message: "Ошибка проверки доставки" };
    } catch (error) {
      return { error, message: "Ошибка проверки доставки" };
    }
  }

  async getInfo(request_id) {
    const { token, url } = this.getAuth();

    try {
      const response = await axios.get(
        `${url}request/info?request_id=${request_id}`,
        {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.state) {
        return { ...response.data };
      }

      return { error: response.data, message: "Ошибка проверки доставки" };
    } catch (error) {
      return { error, message: "Ошибка проверки доставки" };
    }
  }

  async getDates(request_id) {
    const { token, url } = this.getAuth();

    try {
      const response = await axios.get(
        `${url}request/actual_info?request_id=${request_id}`,
        {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.delivery_date) {
        return { ...response.data };
      }

      return { error: response.data, message: "Ошибка проверки доставки" };
    } catch (error) {
      return { error, message: "Ошибка проверки доставки" };
    }
  }

  async getPVZList(address) {
    const { token, url } = this.getAuth();
    const data = {
      longitude: {
        from: Number(address.data.geo_lon) - this.nearby,
        to: Number(address.data.geo_lon) + this.nearby,
      },
      latitude: {
        from: Number(address.data.geo_lat) - this.nearby,
        to: Number(address.data.geo_lat) + this.nearby,
      },
      payment_methods: ["already_paid"],
    };

    try {
      const response = await axios.post(
        `${url}pickup-points/list`,
        { ...data },
        {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.points) {
        return response.data;
      }

      return { error: response.data, message: "Ошибка проверки доставки" };
    } catch (error) {
      return { error, message: "Ошибка проверки доставки" };
    }
  }

  async getInterval(address) {
    const { token, url, platform_station_id } = this.getAuth();

    try {
      const response = await axios.get(`${url}offers/info`, {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          Authorization: `Bearer ${token}`,
        },
        params: {
          station_id: platform_station_id,
          full_address: address.value,
        },
      });

      if (response.data?.offers) {
        return response.data;
      }

      return { error: response.data, message: "Ошибка проверки доставки" };
    } catch (error) {
      return { error, message: "Ошибка проверки доставки" };
    }
  }
}

module.exports = YandexDeliveryService;
