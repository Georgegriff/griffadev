importScripts("https://unpkg.com/comlink/dist/umd/comlink.min.js");
importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest");
importScripts("https://cdn.jsdelivr.net/npm/@tensorflow-models/universal-sentence-encoder");

const MAX_RESULTS = 8;

let model;

const load = async () => {
    const loadModel = async () => {
      const model = await use.load();
      console.log("model loaded");
      return model;
    };
    model = await loadModel();
}

//// cosine similarity fns
const dotProduct = (vector1, vector2) => {
  return vector1.reduce((product, current, index) => {
    product+= current * vector2[index];
    return product;
  }, 0)
};

const mul = (vector1, vector2) => {
  return vector1.map((curr, index) => {
    return curr * vector2[index]
  })
}

const vectorMagnitude = (vector) => {
  return Math.sqrt(vector.reduce((sum, current) => {
    sum += current *  current;
    return sum;
  }, 0))
}


const cosineSimilarity = (vector1, vector2) => {
  return dotProduct(vector1, vector2) / (vectorMagnitude(vector1) * vectorMagnitude(vector2))
}

async function search(userInput, data) {
    const t0 = performance.now();
    const t4 = performance.now();
    const dataTensor = await model.embed(data.map((d) => d.searchData));
    const userInputTensor = await model.embed(userInput);
    const t5 = performance.now();
    console.log(`Embedding vectors took ${t5 - t4} milliseconds.`);
    const inputVector = await userInputTensor.array();
    const dataVector = await dataTensor.array();
    
    const allPredictions = userInput.map((input, index) => {
  
      const predictions = dataVector.map((dataEntry, dataEntryIndex) => {
        const t2 = performance.now();
        const similarity = cosineSimilarity(inputVector[index], dataEntry);
        const t3 = performance.now();
        console.log(`Cosine similarity calc took ${t3 - t2} milliseconds.`);
      
        return {
          similarity,
          result: data[dataEntryIndex]
        }
        // sort descending
      }).sort((a, b) => b.similarity - a.similarity).slice(0,MAX_RESULTS);
      const t2 = performance.now();
      return {
        "input": input,
        predictions: predictions
      }
    })
  
    console.log(allPredictions)
    allPredictions.forEach((p) => {
      console.log(`${p.input}`)
      console.table(p.predictions)
    })
  
    const t1 = performance.now();
    console.log(`Search took ${t1 - t0} milliseconds.`);
    return allPredictions
  }

const Searcher = {
    search,
    load
}

Comlink.expose(Searcher);
