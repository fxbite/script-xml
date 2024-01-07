const xml2js = require('xml2js');

async function getContractID() {
    // Return result
    let resultContract = []
    const attribute1Name = 'FeatureTypeID';
    const attribute1Value = '345';
    const attribute2Name = 'DetailTypeID';
    const attribute2Value = '1432';
  
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
  
        const desiredElements = findElementsWithAttributeValues(result, attribute1Name, attribute1Value, attribute2Name, attribute2Value); 
        desiredElements.forEach(object => {
          resultContract.push(object.FeatureVersion[0].VersionDetail[0]["_"])
        })
      })
  
      console.log(`Done: ${new Date().toISOString()}`)
      console.log(resultContract.length)
      return resultContract 
    } catch (error) {
      console.log(`Error Handler: ${error}`)
    }
  }
  
getContractID()


