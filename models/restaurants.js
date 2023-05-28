const mongoose = require('mongoose')
const Schema = mongoose.Schema
const restaurantSchema = new Schema({
  id: {
    type: Number,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  name_en: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  google_map: {
    type: String,
    required: false,
  },
  rating: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  userId: {
    // 加入關聯設定
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true,
  },
})
module.exports = mongoose.model('Restaurant', restaurantSchema)
/*{
      "id": 1,
      "name": "Sababa 沙巴巴中東美食",
      "name_en": "Sababa Pita Bar",
      "category": "中東料理",
      "image": "https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5635/01.jpg",
      "location": "台北市羅斯福路三段 283 巷 17 號",
      "phone": "02 2363 8009",
      "google_map": "https://goo.gl/maps/BJdmLuVdDbw",
      "rating": 4.1,
      "description": "沙巴巴批塔是台灣第一家純手工批塔專賣店,只選用最新鮮的頂級原料,以及道地的中東家傳配方。"
    }
*/
