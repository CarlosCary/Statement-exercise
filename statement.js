let playsGlobal;
let invoiceGlobal;
function playFor(aPerformance) {
  return playsGlobal[aPerformance.playID];
}

function statement (invoice, plays) {
  playsGlobal = plays;
  invoiceGlobal = invoice;
  
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);;
  return renderPlainText(statementData, plays);

}

function renderPlainText(data, plays) { 
  let result = `Statement for ${data.customer}\n`; 
  for (let perf of data.performances) {
    result += ` ${perf.play.name}: ${usd(amountFor(perf))} (${perf.audience} seats)\n`;
  }
  result += `Amount owed is ${usd(totalAmount(data))}\n`; result += `You earned ${totalVolumeCredits(data)} credits\n`; return result;
}


function amountFor(perf) {
  let thisAmount = 0;
  switch (perf.play.type) {
    case "tragedy":
      thisAmount = 40000;
      if (perf.audience > 30) {
        thisAmount += 1000 * (perf.audience - 30);
      }
      break;
  case "comedy":
    thisAmount = 30000;
    if (perf.audience > 20) {
      thisAmount += 10000 + 500 * (perf.audience - 20);
    }
    thisAmount += 300 * perf.audience;
    break;
  default:
    throw new Error(`unknown type: 
    ${perf.play.type}`);
  }
  return thisAmount;
}

function volumeCreditsFor(aPerformance) {
  let result = 0;
  result += Math.max(aPerformance.audience - 30, 0);
  if ("comedy" === aPerformance.play.type) result += Math.floor(aPerformance.audience / 5);
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

function totalVolumeCredits(data) {
  let result = 0;
  for (let perf of data.performances) {
    result += volumeCreditsFor(perf); 
  }
  return result; 
}

function appleSauce() {
  let totalAmount = 0;
  for (let perf of invoiceGlobal.performances) {
    totalAmount += amountFor(perf); }
  return totalAmount; 
}

function totalAmount(data) {
  let result = 0;
  for (let perf of data.performances) {
    result += amountFor(perf);
  }
  return result; 
}

function enrichPerformance(aPerformance) {
  const result = Object.assign({}, aPerformance); 
  result.play = playFor(result);
  return result;
}

  
export default statement;