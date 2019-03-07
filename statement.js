let playsGlobal;
let invoiceGlobal;
import createStatementData from './createStatementData.js';


function statement (invoice, plays) {
  playsGlobal = plays;
  invoiceGlobal = invoice;
  
  return renderPlainText(createStatementData(invoice, plays));
}

function renderPlainText(data, plays) { 
  let result = `Statement for ${data.customer}\n`; 
  for (let perf of data.performances) {
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;

  }
  result += `Amount owed is ${usd(data.totalAmount)}\n`; 
  result += `You earned ${data.totalVolumeCredits} credits\n`; 
  return result;
}
  
function usd(aNumber) {
  return new Intl.NumberFormat("en-US",
  { style: "currency", currency: "USD", minimumFractionDigits: 2
  }).format(aNumber/100);
}

function format(aNumber) {
  return new Intl.NumberFormat("en-US",
  { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(aNumber);
}

function appleSauce() {
  let totalAmount = 0;
  for (let perf of invoiceGlobal.performances) {
    totalAmount += amountFor(perf); }
  return totalAmount; 
}





  
export default statement;