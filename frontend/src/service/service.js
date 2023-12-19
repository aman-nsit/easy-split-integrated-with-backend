
class priority_queue {
  constructor() {
    this.pq = [];
  }
  // apply heapify on a child heap with top ind  -> root .
  heapify(root){
      let left_ind = 2 * root +1;
      let right_ind = 2 * root +2 ; 
      let largest = root;
      if (left_ind < this.pq.length && this.pq[left_ind][0] > this.pq[largest][0]) {
        largest = left_ind;
      }
      if (right_ind < this.pq.length && this.pq[right_ind][0] > this.pq[largest][0]) {
        largest = right_ind;
      }
      if (largest !== root) {
        //swap
        let temp = this.pq[root][0];
        this.pq[root][0] = this.pq[largest][0];
        this.pq[largest][0] = temp;
        //swap
        temp = this.pq[root][1];
        this.pq[root][1] = this.pq[largest][1];
        this.pq[largest][1] = temp;

        this.heapify(largest);  // recursive call to check further
      }
  }
  // insert new element in heap .
  insert(element) {
    this.pq.push(element);
    let ind = this.pq.length-1;
    while(ind!==0 ){
      let par = Math.floor((ind-1)/2) ;
      
      if(this.pq[par][0] < this.pq[ind][0]){
        //swap
        let temp = this.pq[ind][0];
        this.pq[ind][0] = this.pq[par][0];
        this.pq[par][0] = temp;
        // swap
        temp=this.pq[ind][1];
        this.pq[ind][1] = this.pq[par][1];
        this.pq[par][1] = temp;
      }
      else break ;
    }
  }
  // remove top element of heap .
  remove() {
    let last_ind = this.pq.length-1;
    //swap
    let temp = this.pq[last_ind][0];
    this.pq[last_ind][0] = this.pq[0][0];
    this.pq[0][0] = temp;
    //swap
    temp = this.pq[last_ind][1];
    this.pq[last_ind][0] = this.pq[0][1];
    this.pq[0][1] = temp;

    this.pq.pop();
    this.heapify(0);
  }
  // get the top element of heap .
  top() {
    return JSON.parse(JSON.stringify(this.pq[0]));
  }
  // check heap is empty or not .
  isEmpty() {
    return (this.pq.length === 0);
  }
}


function billCalculator(members,expense) {

    let size = members.size;
    let individual = expense/size ;
    var receiver = new priority_queue();  // heap for member recieve money from others
    var giver = new priority_queue();     // heap for member give mone to other members

    for (let [member,amount] of members) {
      if (amount > individual) {           // if spend more money from avg spend
        receiver.insert([amount - individual, member]);
      } 
      else if (amount < individual) {      // if spend less money from avg spend
        giver.insert([individual -amount, member]);
      }
    }

    let ans = [];  // resultant array to store details of min. no. of transactions to settle down bills .

    while (!receiver.isEmpty() && !giver.isEmpty()) {
      let a = receiver.top();
      let b = giver.top();
      
      receiver.remove();
      giver.remove();

      if (a[0] === b[0]) {
        ans.push([b[1], a[1], a[0]]);
      } 
      else if (a[0] > b[0]) {
        ans.push([b[1], a[1], b[0]]);
        receiver.insert([a[0] - b[0], a[1]]);
      } 
      else {
        ans.push([b[1], a[1], a[0]]);
        giver.insert([b[0] - a[0], b[1]]);
      }

    }

    return ans;
}

export default billCalculator ; 