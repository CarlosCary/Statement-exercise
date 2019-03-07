let playsGlobal;
let invoiceGlobal;

export default function createStatementData(invoice, plays) {
    playsGlobal = plays;
    invoiceGlobal = invoice;

    const result = {};
    result.customer = invoice.customer;
    result.performances = invoice.performances.map(enrichPerformance); 
    result.totalAmount = totalAmount(result); 
    result.totalVolumeCredits = totalVolumeCredits(result);
    return result;
}

function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance); 
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
}

function playFor(aPerformance) {
    return playsGlobal[aPerformance.playID];
}

function volumeCreditsFor(aPerformance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" === aPerformance.play.type) result += Math.floor(aPerformance.audience / 5);
    return result; 
}

function totalAmount(data) {
    return data.performances.reduce((total, p) => total + p.amount, 0);
}

function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
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