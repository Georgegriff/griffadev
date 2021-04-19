// this list should match the `filter` list in tags.md
const tagFilters = ["all", "nav", "post", "posts", "series"];

const filterTags = (tag) => !tagFilters.includes(tag);
module.exports = {
  filterCollectionTags: filterTags,
  removeCollectionTags: (tags) => tags.filter(filterTags),
  getSiblingContent(collection, item, limit = 2, random = true) {
    let filteredItems = collection.filter((x) => {
        // make sure the recommendation is not the or previous article
        return x.url !== item.url
    });

    if (random) {
      let counter = filteredItems.length;

      while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        counter--;

        let temp = filteredItems[counter];

        // Swap the last element with the random one
        filteredItems[counter] = filteredItems[index];
        filteredItems[index] = temp;
      }
    }

    // Lastly, trim to length
    if (limit > 0) {
      filteredItems = filteredItems.slice(0, limit);
    }

    return filteredItems;
  },
  getPagination: (pagination, paged) => {
    if(!paged.hasNext) {
      delete pagination.href.next;
    }
    if(!paged.hasPrev) {
      delete pagination.href.previous;
    }
    return {
      ...pagination
    };
  },
  get year() {
    return new Date().getFullYear()
  }
};
