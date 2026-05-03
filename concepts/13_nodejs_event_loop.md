# Concept 13: The Node.js Event Loop & Execution Context

## 1. The Core Components

JavaScript is **single-threaded**. It can only do one thing at a time. To handle asynchronous operations without freezing, it relies on a whole system, not just the language itself.

*   **The Call Stack:** Where your synchronous code runs. It executes one function at a time (Last In, First Out). If the Call Stack is busy, nothing else can happen.
*   **Web APIs (Browser) / C++ APIs & libuv (Node.js):** The "Kitchen". When JS hits a long-running task (like a database query or `setTimeout`), it hands the heavy lifting off to these background systems provided by the browser or OS.
*   **The Task Queue (Macrotask Queue):** Where callbacks from older, callback-based APIs (like `setTimeout`, `setInterval`, file system operations) wait after the background work is done.
*   **The Microtask Queue:** Where callbacks from Promises (`.then`, `.catch`, `async/await`) wait. **This queue has VIP Priority.**
*   **The Event Loop:** The "Manager". An infinite loop that constantly asks: *"Is the Call Stack empty?"* If yes, it pushes waiting tasks to the Call Stack.

---

## 2. The Golden Rule of the Event Loop
The Event Loop strictly follows this order:
1.  Execute synchronous code on the Call Stack.
2.  When the Call Stack is empty, check the **Microtask Queue** (Promises).
3.  Empty the *entire* Microtask Queue. If a microtask creates another microtask, it handles that one too before moving on.
4.  Once the Microtask Queue is completely empty, it takes **one** task from the **Task Queue** (`setTimeout`).
5.  Repeat.

---

## 3. The Classic Interview Quiz (From the Video)

Look at this code. What order do the numbers print?

```javascript
Promise.resolve().then(() => console.log(1)); // Microtask
setTimeout(() => console.log(2), 0);          // Task (Macrotask)
queueMicrotask(() => {                        // Microtask
    console.log(3);
    queueMicrotask(() => console.log(4));     // Nested Microtask
});
console.log(5);                               // Synchronous
```

**The Answer: `5, 1, 3, 4, 2`**

**Why?**
1.  `console.log(5)` runs immediately (Call Stack).
2.  Call stack is empty. Event loop checks the **Microtask Queue**.
3.  Runs the Promise: prints `1`.
4.  Runs the first `queueMicrotask`: prints `3`.
5.  That microtask spawned *another* microtask. The Event Loop stays in the Microtask Queue and runs it: prints `4`.
6.  Microtask Queue is now totally empty. Event loop moves to the **Task Queue**.
7.  Runs the `setTimeout` callback: prints `2`.

---

## 4. The "10,000 Users" Interview Answer

**Question:** "Node.js is single-threaded. How does it handle 10,000 concurrent database queries without freezing?"

**Answer:**
> "Node.js executes our JavaScript on a single Main Thread (the Call Stack). However, when a request requires a database query, the Main Thread doesn't sit there waiting. It offloads that I/O task to the OS kernel via the `libuv` C++ library. 
> Because the OS handles network operations concurrently in the background, the Main Thread is instantly free to accept the next user's request. When the database replies, the callback function is placed into a queue. The Event Loop constantly monitors these queues, and when the Call Stack is empty, it pushes the callback back onto the main thread to send the HTTP response."
