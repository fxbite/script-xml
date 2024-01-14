const xml2js = require('xml2js');
const fs = require('fs');

async function getContractID() {
    // Return result
    let resultContract = {}
    const attributeAsset = 'FeatureTypeID';
    const attributeAddress = 'DetailTypeID';
    const assetsMapping = [
      'XBT',
      'ETH',
      'XMR',
      'LTC',
      'ZEC',
      'DASH',
      'BTG',
      'ETC',   
      'BSV',
      'BCH',
      'XVG',
      'USDT',
      'XRP',
      'ARB',
      'BSC',
      'USDC',
      'TRX'
    ]

    const attributes = {
      'FeatureTypeID': { 
        XBT: '344',
        ETH: '345',
        XMR: '444',
        LTC: '566',
        ZEC: '686',
        DASH: '687',
        BTG: '688',
        ETC: '689',   
        BSV: '706',
        BCH: '726',
        XVG: '746',
        USDT: '887',
        XRP: '907',
        ARB: '1007',
        BSC: '1008',
        USDC: '998',
        TRX: '992'
      },
      'DetailTypeID': '1432'
    }
  
    const findElementsWithAttributeValue = (obj, attributeName, attributeValue) => {
      const elements = [];
  
      if (obj instanceof Object) {
        for (const prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            if (prop === '$' && obj[prop][attributeName] === attributeValue) {
              elements.push(obj);
            } else {
              const childElements = findElementsWithAttributeValue(obj[prop], attributeName, attributeValue);
              elements.push(...childElements);
            }
          }
        }
      }
  
      return elements;
    }
  
    const findElementsWithAttributeValues = (obj, attribute1Name, attribute1Value, attribute2Name, attribute2Value) => {
      const elements = [];
  
      if (obj instanceof Object) {
        for (const prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            if (prop === '$' && obj[prop][attribute1Name] === attribute1Value) {
              const childElements = findElementsWithAttributeValue(obj, attribute2Name, attribute2Value);
              if (childElements.length > 0) {
                elements.push(obj);
              }
            } else {
              const childElements = findElementsWithAttributeValues(obj[prop], attribute1Name, attribute1Value, attribute2Name, attribute2Value);
              elements.push(...childElements);
            }
          }
        }
      }
  
      return elements;
    }
  
    try {
      console.log(`Start: ${new Date().toISOString()}`)
      const xmlURL = 'https://www.treasury.gov/ofac/downloads/sanctions/1.0/sdn_advanced.xml'
      const response = await fetch(xmlURL)
      if (!response.ok) throw new Error('Error fetching data');
  
      // Handle response data
      const data = await response.text()
      xml2js.parseString(data, (err, result) => {
        if (err) {
          throw new Error('Error parsing the XML:', err)
        }
  
        assetsMapping.forEach(asset => {
          const desiredElements = findElementsWithAttributeValues(result, attributeAsset, attributes[attributeAsset][asset], attributeAddress, attributes[attributeAddress]); 
          resultContract[asset] = { address: [] }
          desiredElements.forEach(object => {
            resultContract[asset]['address'].push(object.FeatureVersion[0].VersionDetail[0]["_"])
          })
          const totalAddress = resultContract[asset]['address'].length
          resultContract[asset]['total'] = totalAddress
        })
      })
      console.log(`Done: ${new Date().toISOString()}`)

      // For Testing (write into a json file)
      const jsonContent = JSON.stringify(resultContract, null, 2);
      fs.writeFileSync('resultContract.json', jsonContent);
      console.log('resultContract has been written to resultContract.json');

      return resultContract 
    } catch (error) {
      console.log(`Error Handler: ${error}`)
    }
  }
  
getContractID()


