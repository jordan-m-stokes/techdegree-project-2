//retrieval of needed elements
const studentList = document.querySelector(".student-list");
const pageLinkList = document.querySelector(".page-link-list");
const searchBarContainer = document.querySelector(".page-header");

/* - set to display only the students on given "pageIndex"

     args: "pageIndex": the index for the page to display (1 less than the page number)
           "studentList": a "ul" or "ol" element that contains all the "li" student elements
           "linkList": a "ul" or "ol" element that contains all the "a" page link elements */
function showPage(pageIndex, studentList, linkList)
{
    const students = studentList.querySelectorAll("li:not(.exclude)");
    const pageLinks = linkList.querySelectorAll("a");

    //indexs that define the range of students to display based on this page
    const firstStudent = pageIndex * 10;
    const lastStudent = firstStudent + 9;

    //set all elements not in the pages range to hidden and vise versa
    for(let studentIndex = 0; studentIndex < students.length; studentIndex++)
    {
        if(studentIndex >= firstStudent && studentIndex <= lastStudent)
        {
            students[studentIndex].classList.remove("hidden");
        }
        else
        {
            students[studentIndex].classList.add("hidden");
        }
    }
    //sets the link representing this page to active and vise versa
    for(let linkIndex = 0; linkIndex < pageLinks.length; linkIndex++)
    {
        if(linkIndex === pageIndex)
        {
            pageLinks[linkIndex].classList.add("active");
        }
        else
        {
            pageLinks[linkIndex].classList.remove("active");
        }
    }
}

/* - generates page links based on number of students (10 students per page)
   - event handler for generated links call "showPage" function in order to switch between pages

     args: "studentList": a "ul" or "ol" element that contains all the "li" student elements
           "linkList": a "ul" or "ol" element that contains all the "a" page link elements */
function appendPageLinks(studentList, linkList)
{
    //calculation of needed number of page links
    const students = studentList.querySelectorAll("li:not(.exclude)");
    const numberOfLinks = Math.ceil(students.length / 10);

    //links are only need if there are two or more pages, so this returns if there aren't.
    if(numberOfLinks === 1){ return; }

    //the html representing all page links
    let html = "";

    //html construction
    for(let count = 0; count < numberOfLinks; count++)
    {
        html +=
        `<li class="page-link">
            <a href="#">${count + 1}</a>
        </li>`
    }

    linkList.innerHTML = html;

    //event listener to handle page navigation
    linkList.addEventListener('click', function(event)
    {
        const pageLinks = linkList.querySelectorAll(".page-link a");

        showPage(Array.from(pageLinks).indexOf(event.target), studentList, linkList);
    });

    return linkList;
}


/* - searches for students based on the "search" and constructs a new page navigation system based on new student list

     args: "search: a string used to search "studentList"
           "studentList": a "ul" or "ol" element that contains all the "li" student elements
           "linkList": a "ul" or "ol" element that contains all the "a" page link elements*/
function searchList(search, studentList, linkList)
{
    const students = studentList.querySelectorAll("li");
    const noResults = studentList.querySelector(".no-results")

    for(let index = 0; index < students.length; index++)
    {
        //retrieval of student info
        const student = students[index];
        const name = student.querySelector("h3").innerHTML;
        const email = student.querySelector(".email").innerHTML;

        //checks if name or email contains the user's search
        //uses "exclude" class to exclude student from list
        if(name.search(search) > -1 || email.search(search) > -1)
        {
            student.classList.remove("exclude");
        }
        else
        {
            student.classList.add("exclude");
        }
    }

    /* logic:   if the number of students is equal to the number of students
                set to the class name "exclude," there were 0 search results.
       Purpose: displays or hides "no results found" accordingly */
    if(studentList.querySelectorAll(".exclude").length === students.length)
    {
        noResults.classList.remove("hidden");
    }
    else
    {
        noResults.classList.add("hidden");
    }

    //removes page links since users search likely leaves the wrong number of them
    linkList.innerHTML = "";

    //refreshes page to display search to user
    appendPageLinks(studentList, linkList);
    showPage(0, studentList, linkList);
}

/* - generates a search bar to search student list
   - event handler for search bar calls "showPage" function in order to switch between pages

     args: "container": a "div" element to append a newly constructed search bar
           "studentList": a "ul" or "ol" element that contains all the "li" student elements
           "linkList": a "ul" or "ol" element that contains all the "a" page link elements*/
function appendSearchBar(container, studentList, linkList)
{
    //appends search bar html to its container
    container.innerHTML +=
        `<div class="student-search">
          <input placeholder="Search for students...">
          <button>Search</button>
        </div>`

    //needed elements
    const searchBar = container.querySelector(".student-search");
    const searchButton = searchBar.querySelector("button");
    const searchField = searchBar.querySelector("input");

    //function to be called by event handlers
    const performSearch = function(event)
    {
        //ensures that the event was either a button click or from enter key being pressed
        if(event.type === "click" || (event.type === "keypress" && event.which === 13))
        {
            let search = "" + searchField.value;
            searchList(search, studentList, linkList);
        }
    }

    //event handler for when the user clicks the search button
    searchButton.addEventListener("click", performSearch);
    //event handler for when the user hits a key (in case enter is hit)
    searchField.addEventListener("keypress", performSearch);
}

//creates initial view on page 1
appendPageLinks(studentList, pageLinkList);
appendSearchBar(searchBarContainer, studentList, pageLinkList);
showPage(0, studentList, pageLinkList);
