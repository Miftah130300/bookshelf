const newBook= [];
const RENDER_EVENT = 'render-read';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBookRead();
    });
    if (isStorageExist()) {
        loadDataFromStorage();
    }
  });

function addBookRead() {
    const inputBookTitle = document.getElementById('inputBookTitle').value;
    const inputBookAuthor = document.getElementById('inputBookAuthor').value;
    const inputBookYear = document.getElementById('inputBookYear').value;
    
    const checklist = document.getElementById('inputBookIsComplete').checked;
    // console.log(checklist)
   
    const generatedID = generateId();
    let isComplete;
    if (checklist) {
        isComplete = true;
    } else {
        isComplete = false;
    }
    console.log(isComplete)

    const bookObject = generateBookObject(generatedID, inputBookTitle, inputBookAuthor, inputBookYear, isComplete);
    newBook.push(bookObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
  }
   
function generateBookObject(id, judul, penulis, tahun, isComplete) {
    return {
      id: id,
      judul: judul,
      penulis: penulis,
      tahun: parseInt(tahun),
      isComplete
    }
  }

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedReading = document.getElementById('incompleteBookshelfList');
    uncompletedReading.innerHTML = '';

    const completedReading = document.getElementById('completeBookshelfList');
    completedReading.innerHTML= '';

    for (const sebuahBuku of newBook) {
        const elemenBuku = inputBuku(sebuahBuku);
        if (!sebuahBuku.isComplete) {
        uncompletedReading.append(elemenBuku);
        } else {
        completedReading.append(elemenBuku);
        }
    }
    console.log(newBook);
  });

function inputBuku (bookObject) {
    const title = document.createElement('h3');
    title.innerText = bookObject.judul;

    const author = document.createElement('p');
    author.innerText = `Penulis : ${bookObject.penulis}`;

    const year = document.createElement('p');
    year.innerText = bookObject.tahun;
    year.style.fontWeight ='bold';

    const bookContainer = document.createElement('article');
    bookContainer.setAttribute('id', `ID${newBook.id}`);
    bookContainer.style.border = '2px solid black';
    bookContainer.style.padding = '10px';
    bookContainer.style.margin = '10px';
    bookContainer.style.borderRadius = '10px';
    bookContainer.append(title, author, year);

    if (bookObject.isComplete){
        const buttonGreen = document.createElement('button');
          buttonGreen.style.color = 'white';
          buttonGreen.style.backgroundColor = 'darkgreen';
          buttonGreen.style.padding = '10px';
          buttonGreen.style.margin = '10px';
          buttonGreen.style.borderRadius = '10px';
          buttonGreen.style.fontFamily= 'Open Sans', 'sans-serif';
            buttonGreen.innerText = 'Belum Selesai Dibaca';
            buttonGreen.addEventListener('click', function(){
                addToAfterRead(bookObject.id);
              });
    
        const buttonRed = document.createElement('button');
          buttonRed.style.color = 'white';
            buttonRed.style.backgroundColor = 'darkred';
            buttonRed.innerText = 'Hapus buku';
            buttonRed.style.padding = '10px';
            buttonRed.style.margin = '10px';
            buttonRed.style.borderRadius = '10px';
            buttonRed.style.fontFamily= 'Open Sans', 'sans-serif';  
            buttonRed.addEventListener('click', function(){
                addToRemoveRead(bookObject.id);
              });
            
            bookContainer.append(buttonGreen, buttonRed);
            
        } else {
          const buttonGreen = document.createElement('button');
            buttonGreen.style.color = 'white';
            buttonGreen.style.backgroundColor = 'darkgreen';
            buttonGreen.style.padding = '10px';
            buttonGreen.style.margin = '10px';
            buttonGreen.style.borderRadius = '10px';
            buttonGreen.style.fontFamily= 'Open Sans', 'sans-serif';
              buttonGreen.innerText = 'Selesai dibaca';
              buttonGreen.addEventListener('click', function(){
                  addToBeforeRead(bookObject.id);
                });
      
          const buttonRed = document.createElement('button');
            buttonRed.style.color = 'white';
              buttonRed.style.backgroundColor = 'darkred';
              buttonRed.innerText = 'Hapus buku';
              buttonRed.style.padding = '10px';
              buttonRed.style.margin = '10px';
              buttonRed.style.borderRadius = '10px';
              buttonRed.style.fontFamily= 'Open Sans', 'sans-serif';  
              buttonRed.addEventListener('click', function(){
                  addToRemoveRead(bookObject.id);
                });
            bookContainer.append(buttonGreen, buttonRed);
        }
    
        return bookContainer;
    }

function addToAfterRead(bookId) {
    const idBukunya = findBookId(bookId);
    
    if (idBukunya == null) return;
    
    idBukunya.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    }

function findBookId(bookId) {
    for (const sebuahBuku of newBook) {
    if (sebuahBuku.id == bookId) {
    return sebuahBuku;
    }
    }
    return null;
    }

// fungsi untuk button green menuju "Belum selesai dibaca"
function addToBeforeRead(bookIdAfter) {
    const idBukunyaAfter = findBookAfter(bookIdAfter);

    if (idBukunyaAfter == null) return;

    idBukunyaAfter.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookAfter(bookIdAfter) {
    for (const sebuahBuku of newBook) {
        if (sebuahBuku.id == bookIdAfter) {
            return sebuahBuku;
        }
    }
    return null;
}

function addToRemoveRead(bookIdRemove) {
    const targetBuku = findTodoIndex(bookIdRemove);
   
    if (targetBuku === -1) return;
   
    newBook.splice(targetBuku, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findTodoIndex(bookIdRemove){
    for (const index in newBook) {
        if (newBook[index].id === bookIdRemove) {
            return index;
        }
    }
    return -1;
}

function saveData() {
    if (isStorageExist) {
        const parsed = JSON.stringify(newBook);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = 'saved-read';
const STORAGE_KEY = 'BOOKSHELF-APPS';

function isStorageExist (){
    if (typeof(Storage) === undefined) {
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });

  function loadDataFromStorage() {
    const tampilkanData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(tampilkanData);

    if (data !== null) {
        for (const read of data) {
            newBook.push(read);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}