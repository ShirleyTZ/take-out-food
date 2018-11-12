function bestCharge(selectedItems) {
  const sheet = {
    items : selectedItems.map(items => {
      [id,number]=items.split(" x ")
      return {
        id,
        number: +number,
      }
    })
  }

  const allItems = loadAllItems();
  sheet.items = sheet.items.map(item => {
    return {...item,...allItems.find(i => i.id === item.id)}
  })

  const orderItems = sheet.items.reduce((pre,now) => pre + now.name + " x " + now.number + " = " + now.price*now.number + "元\n","");

  const [promotionA,promotionB] = loadPromotions();
  const totalPrice = sheet.items.reduce((pre,now) => pre + now.price*now.number,0);
  const [j,m,n] = promotionA.type.match(/满(\d+)减(\d+)/);
  const discountA = totalPrice > m ? +n:0;
  const discountB = sheet.items.reduce((pre,now) => promotionB.items.includes(now.id) ? now.price*0.5*now.number + pre:pre,0);
  const salesItems = sheet.items.filter(item => promotionB.items.includes(item.id)).map(item => item.name);
  sheet.promotion = discountA === 0 && discountB === 0 ? {type:"",discount:0} : discountA > discountB ? {type:promotionA.type,discount:discountA}:{type:promotionB.type,discount:discountB};
  const salesNames = sheet.promotion.type === promotionB.type ? "(" + salesItems.join("，") + ")":"";
  const preferentialWay = sheet.promotion.discount === 0 ? "" : "使用优惠:\n" + sheet.promotion.type + salesNames  + "，省" + sheet.promotion.discount +"元\n" + "-----------------------------------\n";
 
  const shouldPay = "总计：" + (totalPrice - sheet.promotion.discount) + "元\n";

  return "============= 订餐明细 =============\n" + orderItems + "-----------------------------------\n" + preferentialWay + shouldPay + "===================================";
}
