import * as cheerio from 'cheerio'
import axios from 'axios'
import chalk from 'chalk'

const url = 'https://etherscan.io/gastracker'

function getTrend(arr) {
  const lastFive = arr.slice(-5); // get the last five entries in the array
  const diffs = lastFive.map((num, i) => num - lastFive[i - 1]).slice(1); // calculate the differences between each pair of adjacent numbers

  const trend = diffs.reduce((sum, diff) => sum + Math.sign(diff), 0); // calculate the sum of the signs of the differences

  if (trend > 0) {
    return "^";
  } else if (trend < 0) {
    return "v";
  } else {
    return "-";
  }
}

let gasRates = [];

async function scrapeGasRates() {
  try {
    const { data } = await axios.get(url)
    const $ = cheerio.load(data)
    const avgRateSpan = $('#spanAvgPrice')
    const rate = Number.parseInt(avgRateSpan.text())

    gasRates.push(rate);
    const trend = gasRates.length >= 5 ? getTrend(gasRates) : "N/A";

    rate < 25
      ? console.log(chalk.green(avgRateSpan.text()), trend)
      : rate >= 25 && rate < 40
        ? console.log(chalk.blue(avgRateSpan.text()), trend)
        : console.log(chalk.red(avgRateSpan.text()), trend)
  } catch (err) {
    console.error(err)
  }
}

setInterval(scrapeGasRates, 10000)
