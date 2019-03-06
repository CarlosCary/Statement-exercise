let playsGlobal;

function playFor(aPerformance) {
  return playsGlobal[aPerformance.playID];
}

function statement (invoice, plays) {
  playsGlobal = plays;
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  const format = new Intl.NumberFormat("en-US",
                      { style: "currency", currency: "USD",
                        minimumFractionDigits: 2 }).format;
  for (let perf of invoice.performances) {
    // const play = playFor(perf, plays);
    let thisAmount = amountFor(perf);
    
    // add volume credits
    volumeCredits += Math.max(perf.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ("comedy" === playFor(perf).type)
      volumeCredits += Math.floor(perf.audience / 5);

    // print line for this order
    result += ` ${playFor(perf).name}: ${format(thisAmount/100)} (${perf.audience} seats)\n`;
    totalAmount += thisAmount;
  }

  result += `Amount owed is ${format(totalAmount/100)}\n`;
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

export default statement;