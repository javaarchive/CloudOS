/**
 * Copyright 2009 Nicholas C. Zakas. All rights reserved.
 * MIT-Licensed
 * Uses a binary search algorithm to locate a value in the specified array.
 * @param {Array} items The array containing the item.
 * @param {variant} value The value to search for.
 * @return {int} The zero-based index of the value in the array or -1 if not found.
 */
function binarySearch(items, value) {
  var startIndex = 0,
    stopIndex = items.length - 1,
    middle = Math.floor((stopIndex + startIndex) / 2);

  while (items[middle] != value && startIndex < stopIndex) {
    //adjust search area
    if (value < items[middle]) {
      stopIndex = middle - 1;
    } else if (value > items[middle]) {
      startIndex = middle + 1;
    }

    //recalculate middle
    middle = Math.floor((stopIndex + startIndex) / 2);
  }

  //make sure it's the right value
  return items[middle] != value ? -1 : middle;
}
function binaryPlacement(items, value) {
  // Broken :(
  if (items.length == 0) {
    return 0;
  }
  var startIndex = 0,
    stopIndex = items.length - 1,
    middle = Math.floor((stopIndex + startIndex) / 2);

  while (items[middle] != value && startIndex < stopIndex) {
    console.log(startIndex + " " + stopIndex);
    //adjust search area
    if (value < items[middle]) {
      stopIndex = middle - 1;
    } else if (value > items[middle]) {
      startIndex = middle + 1;
    }

    //recalculate middle
    middle = Math.floor((stopIndex + startIndex) / 2);
  }

  //make sure it's the right value
  if (value < stopIndex) {
    return stopIndex - 1;
  }
  //return middle;
}
// Multipurpose Binary Search and insert point finder
// https://stackoverflow.com/questions/12369824/javascript-binary-search-insertion-preformance
function bs(target, arr, comparator) {
  var l = 0,
    h = arr.length - 1,
    m,
    comparison;
  comparator =
    comparator ||
    function(a, b) {
      return -(a < b
        ? -1
        : a > b
        ? 1
        : 0); /* default comparison method if one was not provided */
    };
  while (l <= h) {
    m = (l + h) >>> 1; /* equivalent to Math.floor((l + h) / 2) but faster */
    comparison = comparator(arr[m], target);
    if (comparison < 0) {
      l = m + 1;
    } else if (comparison > 0) {
      h = m - 1;
    } else {
      return m;
    }
  }
  return l;
}
function inArray(target, arr, comparator) {
  var l = 0,
    h = arr.length - 1,
    m,
    comparison;
  comparator =
    comparator ||
    function(a, b) {
      return -(a < b
        ? -1
        : a > b
        ? 1
        : 0); /* default comparison method if one was not provided */
    };
  while (l <= h) {
    m = (l + h) >>> 1; /* equivalent to Math.floor((l + h) / 2) but faster */
    comparison = comparator(arr[m], target);
    if (comparison < 0) {
      l = m + 1;
    } else if (comparison > 0) {
      h = m - 1;
    } else {
      return m;
    }
  }
  return comparison == 0;
}
/*
Modified Array class using above
*/
/* 
    target: the object to search for in the array
    comparator: (optional) a method for comparing the target object type
    return value: index of a matching item in the array if one exists, otherwise the bitwise complement of the index where the item belongs
*/
Array.prototype.binarySearch = function(target, comparator) {
  var l = 0,
    h = this.length - 1,
    m,
    comparison;
  comparator =
    comparator ||
    function(a, b) {
      return a < b
        ? -1
        : a > b
        ? 1
        : 0; /* default comparison method if one was not provided */
    };
  while (l <= h) {
    m = (l + h) >>> 1; /* equivalent to Math.floor((l + h) / 2) but faster */
    comparison = comparator(this[m], target);
    if (comparison < 0) {
      l = m + 1;
    } else if (comparison > 0) {
      h = m - 1;
    } else {
      return m;
    }
  }
  return ~l;
};
/*
    target: the object to insert into the array
    duplicate: (optional) whether to insert the object into the array even if a matching object already exists in the array (false by default)
    comparator: (optional) a method for comparing the target object type
    return value: the index where the object was inserted into the array, or the index of a matching object in the array if a match was found and the duplicate parameter was false 
*/
Array.prototype.binaryInsert = function(target, duplicate, comparator) {
  var i = this.binarySearch(target, comparator);
  if (i >= 0) {
    /* if the binarySearch return value was zero or positive, a matching object was found */
    if (!duplicate) {
      return i;
    }
  } else {
    /* if the return value was negative, the bitwise complement of the return value is the correct index for this object */
    i = ~i;
  }
  this.splice(i, 0, target);
  return i;
};
// Patch array to use negative indexes
function patchArr(arr) {
  return new Proxy(arr, {
    get(target, prop) {
      if (!isNaN(prop)) {
        prop = parseInt(prop, 10);
        if (prop < 0) {
          prop += target.length;
        }
      }
      return target[prop];
    }
  });
  return arr;
}
module.exports = {
  binaryPlacement: binaryPlacement,
  binarySearch: binarySearch,
  bs: bs,
  inArray: inArray
};
