let playsGlobal;

function playFor(aPerformance) {
  return playsGlobal[aPerformance.playID];
}

function statement (invoice, plays) {
  playsGlobal = plays;

  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  
  for (let perf of invoice.performances) {
    volumeCredits += volumeCreditsFor(perf);

    // print line for this order
    result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} seats)\n`;
    totalAmount += amountFor(perf);
  }

  result += `Amount owed is ${usd(totalAmount)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;
}

function amountFor(perf) {
  let thisAmount = 0;
  switch (playFor(perf).type) {
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
    ${playFor(perf).type}`);
  }
  return thisAmount;
}

function volumeCreditsFor(aPerformance) {
  let result = 0;
  result += Math.max(aPerformance.audience - 30, 0);
  if ("comedy" === playFor(aPerformance).type) result += Math.floor(aPerformance.audience / 5);
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



export default statement;