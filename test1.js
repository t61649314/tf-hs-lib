// function quickSort(arr, l, r) {
//   if (l >= r) {
//     return;
//   }
//   let x = l, y = r, base = arr[l];
//   while (x < y) {
//     while (x < y && arr[y] >= base) {
//       y--
//     }
//     if (x < y) {
//       arr[x] = arr[y];
//       x++;
//     }
//     while (x < y && arr[x] < base) {
//       x++
//     }
//     if (x < y) {
//       arr[y] = arr[x];
//       y--;
//     }
//   }
//   arr[x] = base;
//   quickSort(arr, l, x - 1);
//   quickSort(arr, x + 1, r);
// }
//
// function getmid(a, c, b) {
//   if (a > b) {
//     [a, b] = [b, a]
//   }
//   if (a > c) {
//     [a, c] = [c, a]
//   }
//   if (b > c) {
//     [b, c] = [c, b]
//   }
//   return b
// }
// function quickSort2(arr, l, r) {
//
//   while (l < r) {
//     let x = l, y = r, base = getmid(arr[l], arr[parseInt((l + r) / 2)], arr[r]);
//     while (x <= y) {
//       while (arr[y] > base) {
//         y--
//       }
//       while (arr[x] < base) {
//         x++
//       }
//       if (x <= y) {
//         let temp = arr[y];
//         arr[y] = arr[x];
//         arr[x] = temp;
//         x++;
//         y--;
//       }
//     }
//     console.log(arr,x,y)
//     quickSort2(arr, x, r);
//     r = y;
//   }
// }
// //
// // function insertSort(arr) {
// //   for (let i = 0; i < arr.length; i++) {
// //     for (let j = i + 1; j > 0;j-- ) {
// //       if (arr[j] < arr[j - 1]) {
// //         [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
// //       }else{
// //         break
// //       }
// //     }
// //   }
// // }
//
// let arr = [1, 10, 4, 7, 2, 5, 0, 10, 1]
//
//
// quickSort2(arr, 0, 8);

//
// var sortColors = function(nums) {
//   let i=0,j=nums.length-1;
//   while(i<j){
//     while(i<j&&nums[j]!==0){
//       j--
//     }
//     while(i<j&&nums[i]===0){
//       i++
//     }
//     if(i<j){
//       [nums[j],nums[i]]=[nums[i],nums[j]]
//       j--;
//       i++
//     }
//
//   }
//   j=nums.length-1;
//   i=i+1
//   while(i<j){
//     j=nums.length-1
//     while(i<j&&nums[j]===2){
//       j--
//     }
//     while(i<j&&nums[i]===1){
//       i++
//     }
//     if(i<j){
//       [nums[j],nums[i]]=[nums[i],nums[j]]
//       j--;
//       i++
//     }
//   }
// };
// let arr= [2,0,1]
// sortColors(arr)
// console.log(arr)
//

//
// var smallestK = function (arr, k) {
//   function getmid(a, b, c) {
//     if (a > b) {
//       [a, b] = [b, a]
//     }
//     if (a > c) {
//       [a, c] = [c, a]
//     }
//     if (b > c) {
//       [b, c] = [c, b]
//     }
//     return b
//   }
//
//   function quickSort(l, r, kk) {
//     if (r - l <= 0) {
//       return
//     }
//     let i = l, j = r, base = getmid(arr[l], arr[parseInt((r - l) / 2)], arr[r])
//     do {
//       while (arr[j] > base) j--
//       while (arr[i] < base) i++
//       if (i <= j) {
//         [arr[j], arr[i]] = [arr[i], arr[j]]
//         j--
//         i++
//       }
//     } while (i <= j)
//     let len = j - l + 1;
//     if (len === kk) {
//       return;
//     } else if (len > kk) {
//       quickSort(l, j, kk)
//     } else {
//       quickSort(i, r, kk - i + l)
//     }
//   }
//
//   quickSort(0, arr.length - 1, k);
// };
// arr = [8, 6, 9, 10, 7, 5, 1, 2, 3, 4]
// smallestK(arr, 5);
// console.log(arr)
//
// function TreeNode(val, left, right) {
//   this.val = (val === undefined ? 0 : val)
//   this.left = (left === undefined ? null : left)
//   this.right = (right === undefined ? null : right)
// }
//
// var generateTrees = function (n) {
//   function _generate(l, r) {
//     if (l > r) {
//       return [null]
//     }
//     let ans = []
//     for (let i = l; i <= r; i++) {
//       let leftArr = _generate(l, i - 1);
//       let rightArr = _generate(i + 1, r);
//       for (let x = 0; x < leftArr.length; x++) {
//         for (let y = 0; y < rightArr.length; y++) {
//           let k = new TreeNode(i, leftArr[x], rightArr[y])
//           ans.push(k);
//         }
//       }
//
//     }
//     return ans;
//   }
//
//   return _generate(1, n)
// };
// console.log(JSON.stringify(generateTrees(3)));
// var decodeString = function (s) {
//   let result = "", i = 0;
//   while (s[i]) {
//     if (!isNaN(s[i])) {
//       let num = 0;
//       while (!isNaN(s[i])) {
//         num = num * 10 + parseInt(s[i++]);
//       }
//       let count = 1, temp = "";
//       while (count) {
//         i++
//         if (s[i] === "[") {
//           count++
//         } else if (s[i] === "]") {
//           count--
//         }
//         if(count)temp += s[i]
//       }
//       temp = decodeString(temp);
//       while (num--) {
//         result += temp;
//       }
//       i++;
//     } else {
//       result += s[i];
//       i++;
//     }
//   }
//   return result;
// };
// console.log(decodeString("3[a2[c]]"));


function TreeNode(val, left, right) {
  this.val = (val === undefined ? 0 : val)
  this.left = (left === undefined ? null : left)
  this.right = (right === undefined ? null : right)
}

/**
 * Definition for a binary tree node.

 */
/**
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
// var buildTree = function (preorder, inorder) {
//   function _buildTree(pre, ino) {
//     if(!pre.length){
//       return null
//     }
//     let node = new TreeNode()
//     node.val = pre[0]
//     let rootIndex = ino.findIndex(item => item === node.val);
//     console.log(rootIndex)
//     node.left = _buildTree(pre.slice(1, rootIndex + 1), ino.slice(0, rootIndex))
//     node.right = _buildTree(pre.slice(rootIndex + 1, preorder.length), ino.slice(rootIndex + 1, inorder.length))
//     return node;
//   }
//
//   return _buildTree(preorder, inorder);
// };
// let a=[3,9,20,15,7]
// let b=[9,3,15,20,7]
// console.log(buildTree(a,b))
//
//  function TreeNode(val, left, right) {
//      this.val = (val===undefined ? 0 : val)
//        this.left = (left===undefined ? null : left)
//        this.right = (right===undefined ? null : right)
//      }
//
// var widthOfBinaryTree = function(root) {
//   let list=[],ans=0;
//   root.pin=0;
//   list.push(root);
//   while(list.length){
//     let len=list.length;
//     let l=list[0].pin,r;
//     for(let i=0;i<len;i++){
//       r=list[i].pin
//       if(list[i].left){
//         list[i].left.pin=list[i].pin*2
//         list.push(list[i].left)
//       }
//       if(list[i].right){
//         list[i].right.pin=list[i].pin*2+1
//         list.push(list[i].right)
//       }
//       list.pop()
//     }
//     ans=Math.max(ans,r-l+1);
//   }
//   return ans;
// };
//
// widthOfBinaryTree(a);

//
function Heap(data, isBig = true) {
  this.data = [];
  this.isBig = isBig;
  data && data.forEach(item => {
    this.push(item)
  })
}

Heap.prototype.push = function (item) {
  this.data.push(item);
  this.up(this.data.length - 1);
};
Heap.prototype.pop = function () {
  [this.data[0], this.data[this.data.length - 1]] = [this.data[this.data.length - 1], this.data[0]]
  let pop = this.data.pop();
  this.down(0);
  return pop;
}
Heap.prototype.up = function (index) {
  while (index && this.compare(this.data[index], this.data[parseInt((index - 1) / 2)])) {
    [this.data[parseInt((index - 1) / 2)], this.data[index]] = [this.data[index], this.data[parseInt((index - 1) / 2)]]
    index = parseInt((index - 1) / 2)
  }
}
Heap.prototype.down = function (index) {
  while (this.data[index * 2 + 1]) {
    let temp = index;
    if (this.compare(this.data[index * 2 + 1], this.data[temp])) {
      temp = index * 2 + 1
    }
    if (this.data[index * 2 + 2] && this.compare(this.data[index * 2 + 2], this.data[temp])) {
      temp = index * 2 + 2
    }
    if (index === temp) {
      break;
    }
    [this.data[temp], this.data[index]] = [this.data[index], this.data[temp]]
    index = temp;
  }
}
Heap.prototype.compare = function (a, b) {
  return this.isBig ? a > b : a < b;
}
// var getNumberOfBacklogOrders = function(orders) {
//   Heap.prototype.compare = function (a, b) {
//     return this.isBig ? a[0] > b[0] : a[0] < b[0];
//   }
//
//   let h1=new Heap([],true);
//   let h2=new Heap([],false);
//   orders.forEach(item=>{
//     console.log(item)
//     if(item[2]===0){
//       while(h2.data.length&&h2.data[0][0]<item[0]){
//         let temp=item[1];
//         item[1]-=h2.data[0][1];
//         h2.data[0][1]-=temp
//         if(h2.data[0][1]<=0){
//           h2.pop();
//         }
//       }
//       if(item[1]>0){
//         h1.push(item);
//       }
//     }else{
//       while(h1.data.length&&h1.data[0][0]>item[0]){
//         let temp=item[1];
//         item[1]-=h1.data[0][1];
//         h1.data[0][1]-=temp
//         if(h1.data[0][1]<=0){
//           h1.pop();
//         }
//       }
//       if(item[1]>0){
//         h2.push(item);
//       }
//     }
//   })
//   return h1.data.reduce((total,item)=>{
//     return total+item[1]
//   },0)+h2.data.reduce((total,item)=>{
//     return total+item[1]
//   },0)
// };
//
// getNumberOfBacklogOrders([[7,1000000000,1],[15,3,0],[5,999999995,0],[5,1,1]]);

//
function UnionSet(n) {
  this.data = new Array(n)
  this.count = new Array(n)
  for (let i = 0; i < n; i++) {
    this.data[i] = i;
    this.count[i] = 1;
  }
}

UnionSet.prototype.get = function (x) {
  if (this.data[x] === x) {
    return x
  } else {
    let father = this.get(this.data[x]);
    this.data[x] = father;
    return father;
  }
}

UnionSet.prototype.merge = function (a, b) {
  if (this.get(a) === this.get(b)) {
    return;
  }
  this.count[this.get(b)] += this.count[this.get(a)]
  this.data[this.get(a)] = this.get(b)
}
// var longestConsecutive = function(nums) {
//   let u=new UnionSet(nums.length)
//   let index={};
//   for(let i=0;i<nums.length;i++){
//     let item=nums[i]
//     if(index[item]!==undefined) continue
//     index[item]=i;
//     if(index[item-1]!==undefined){
//       u.merge(index[item],index[item-1]);
//     }
//     if(index[item+1]!==undefined){
//       u.merge(index[item],index[item+1]);
//     }
//
//   }
//   let ans=0
//   u.count.forEach(item=>{
//     if(item>ans){
//       ans=item
//     }
//   })
//   return ans
// };
// longestConsecutive([1,2,0,1]);
//
// function merge_sort(arr, l, r) {
//   if (l >= r) {
//     return
//   }
//   let mid = parseInt((l + r) / 2);
//   merge_sort(arr, l, mid)
//   merge_sort(arr, mid + 1, r)
//   let temp = [];
//   let pl = l, pr = mid + 1, p = 0;
//   while (pl <= mid || pr <= r) {
//     if (pl <= mid && (arr[pl] <= arr[pr] || pr > r)) {
//       temp[p++] = arr[pl++]
//     } else if (pr <= r && (arr[pl] > arr[pr] || pr > mid)) {
//       temp[p++] = arr[pr++]
//     }
//   }
//   for (let i = 0; i < temp.length; i++) {
//     arr[l + i] = temp[i];
//   }
//   return arr;
// }
//
// let arr = [11, 12, 9, 8, 7, 6, 5, 4, 3, 2, 1, 10]
// merge_sort(arr, 0, arr.length - 1)
// console.log(arr)
// var countSmaller = function(nums) {
//   let indexList=new Array(nums.length).fill(0);
//   let realIndex={};
//   let temp=[]
//   function mergeSort(l,r){
//     if(l>=r){
//       return
//     }
//     let mid=parseInt((l+r)/2);
//     mergeSort(l,mid);
//     mergeSort(mid+1,r);
//     let pl=l,pr=mid+1,rightCount=0,p=l;;
//
//     while(pl<=mid||pr<=r){
//       console.log(realIndex)
//       if(pr>r||(pl<=mid&&nums[pl]<=nums[pr])){
//         temp[p]=nums[pl];
//         if(realIndex[pl]!==undefined){
//           realIndex[p]=realIndex[pl]
//         }else{
//           realIndex[p]=pl
//         }
//         indexList[realIndex[p]]+=rightCount;
//         p++;
//         pl++
//       }else{
//         temp[p]=nums[pr];
//         rightCount++;
//         if(realIndex[pr]!==undefined){
//           realIndex[p]=realIndex[pr]
//         }else{
//           realIndex[p]=pr
//         }
//         p++;
//         pr++;
//       }
//
//     }
//
//     for(let i=l;i<=r;i++){
//       nums[i]=temp[i];
//     }
//   }
//   mergeSort(0,nums.length-1);
//
//   return indexList;
// };
// countSmaller([5,2,6,1])
// var merge = function(intervals) {
//   let temp=new Array(10000).fill(0);
//   for(let i =0;i<intervals.length;i++){
//     let item=intervals[i];
//     for(let j=item[0];j<=item[1];j++){
//       temp[j]++;
//     }
//   }
//   let res=[], t=[];
//   for(let i=0;i<temp.length;i++){
//
//     if(temp[i]>0&&!t.length){
//       t.push(i)
//     }
//     if(temp[i]===0&&t.length){
//       t.push(i-1)
//       res.push(t)
//       t=[];
//     }
//   }
//   return res;
// };
// merge([[1,3],[2,6],[8,10],[15,18]]);
var findSubsequences = function (nums) {
  let res = []

  function getResult(k, buff) {
    if (buff.length > 1) {
      res.push(buff);
    }
    buff.push(0);

    let i = k;
    for (; i < nums.length; i++) {

      if (buff.length === 1 || buff[buff.length - 2] <= nums[i]) {
        buff[buff.length - 1] = nums[i];

        getResult(i + 1, buff);
      }
    }
  }

  getResult(0, []);
  return res;
};
// findSubsequences([4,6,7,7]);


// var findMedianSortedArrays = function(nums1, nums2) {
//   let n=nums1.length,m=nums2.length;
//   let k=parseInt((m+n+1)/2);
//   let a=findK(0,0,k);
//   if((m+n)%2===1) return a;
//   let b=findK(0,0,k+1);
//   return (a+b)/2;
//
//   function findK(i,j,k){
//     if(i===nums1.length){
//       return nums2[j+k-1]
//     }
//     if(j===nums2.length){
//       return nums1[i+k-1]
//     }
//     if(k===1){
//       return nums1[i]<nums2[j]?nums1[i]:nums2[j]
//     }
//     let a=Math.min(parseInt(k/2),nums1.length-i);
//     let b=Math.min(k-a,nums2.length-j);
//     a=k-b;
//     if(nums1[a+i-1]<=nums2[b+j-1]){
//       return findK(a+i,j,k-a);
//     }
//     return findK(i,j+b,k-b);
//   }
// };
// let a=[1,2]
//   let b=[3,4]
// findMedianSortedArrays(a,b)

var trap = function (height) {
  let dp = [0, 0];
  for (let i = 2; i < height.length; i++) {
    let j = i - 1;
    if (height[j] > height[i]) {
      dp[i] = dp[i - 1];
    } else {
      let low;
      do {
        low = height[j];
        j--
      } while (j > 0 && height[j] < low)

      if (j > 0) {
        let high
        do {
          high = height[j]
          j--
        } while (j >= 0 && height[j] > high)
        high = Math.min(high, height[i]);
        let tiji = 0
        for (let q = j + 2; q < i; q++) {
          tiji += high - height[q]
        }
        dp[i] = dp[j + 1] + tiji;
      }
    }
  }
  console.log(dp)
  return dp[dp.length - 1]
};


var shipWithinDays = function (weights, days) {
  let head = weights[weights.length - 1];
  let tail = weights.reduce((pre, curr) => {
    return pre + curr;
  }, 0)
  while (head < tail) {
    let mid = parseInt((head + tail) / 2);
    let days = getDays(mid);
    if (days <= 5) {
      tail = mid;
    } else {
      head = mid + 1;
    }
  }

  function getDays(k) {
    let d = 1,temp=0;
    for (let i = 0; i < weights.length; i++) {
      if (temp + weights[i] > k) {
        d++;
        temp = 0;
      }
      temp += weights[i]
    }
    return d;
  }

  return head;
};
let a = [3,2,2,4,1,4]

;
shipWithinDays(a, 3)
