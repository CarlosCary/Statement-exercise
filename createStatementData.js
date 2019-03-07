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

class PerformanceCalculator { 
    constructor(aPerformance, aPlay) {
        this.performance = aPerformance; 
        this.play = aPlay;
    }
    get amount() {
        throw new Error('subclass responsibility');
    }
    get volumeCredits() {
        let result = 0;
        result += Math.max(this.performance.audience - 30, 0);
        if ("comedy" === this.play.type) 
            result += Math.floor(this.performance.audience / 5);
        return result; 
    }
}


function createPerformanceCalculator(aPerformance, aPlay) {
    switch(aPlay.type) {
        case "tragedy": 
            return new TragedyCalculator(aPerformance, aPlay);
        case "comedy" : 
            return new ComedyCalculator(aPerformance, aPlay);
        default:
            throw new Error(`unknown type: ${aPlay.type}`);
    } 
}

class TragedyCalculator extends PerformanceCalculator { 
    get amount() {
        let result = 40000;
        if (this.performance.audience > 30) {
            result += 1000 * (this.performance.audience - 30); 
        }
        return result; 
    }
}
class ComedyCalculator extends PerformanceCalculator { 
    get amount() {
        let result = 30000;
        if (this.performance.audience > 20) {
            result += 10000 + 500 * (this.performance.audience - 20); 
        }
        result += 300 * this.performance.audience;
        return result; 
    }
}
function enrichPerformance(aPerformance) {
    const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));
    const result = Object.assign({}, aPerformance); 
    result.play = playFor(result);
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
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
    return new PerformanceCalculator(perf, playFor(perf)).amount;
}