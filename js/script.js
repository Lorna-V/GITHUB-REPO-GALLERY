// GLOBAL VARIABLES ------------------------------------------------------------

// Profile Information 
const overview = document.querySelector(".overview");
const username = "Lorna-V";

// Unordered list to display the repos list.
const repoList = document.querySelector(".repo-list");

// Repo section and data
const repoSection = document.querySelector(".repos");
const repoDataSection = document.querySelector(".repo-data");

// Select a button and input
const viewReposButton = document.querySelector(".view-repos");
const filterInput = document.querySelector(".filter-repos")


//  USER & REPO DATA FETCH AND INFORMATION TO DISPLAY ------------------------------------------------------------

// Fetch & Display User Information
const gitUserInfo = async function (){
    const userInfo = await fetch(`https://api.github.com/users/${username}`);
    const data = await userInfo.json(); 
    displayUserInfo(data);
};

gitUserInfo();

const displayUserInfo = function (data) {
  const div = document.createElement("div");
  div.classList.add("user-info");
  div.innerHTML = `
    <figure>
        <img alt="user avatar" src=${data.avatar_url} />
    </figure>
    <div>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Bio:</strong> ${data.bio}</p>
        <p><strong>Location:</strong> ${data.location}</p>
        <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
    </div>
`;
  overview.append(div);
  gitRepos();
};

// Fetch & Display Repo Information 
const gitRepos = async function () {
  const fetchRepos = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
  const repoData = await fetchRepos.json();
  displayRepos (repoData);
};

const displayRepos = function (repos){
  filterInput.classList.remove("hide");
  for(const repo of repos) {
    const repoItem = document.createElement("li");
    repoItem.classList.add("repo");
    repoItem.innerHTML = `<h3>${repo.name}</h3>`;
    repoList.append(repoItem);
  }
};

// Select and get specific repo info
repoList.addEventListener ("click", function(e){
  if (e.target.matches("h3")){
    const repoName = e.target.innerText;
    getRepoInfo(repoName);
  }
});

const getRepoInfo = async function (repoName){
  const fetchInfo = await fetch (`https://api.github.com/repos/${username}/${repoName}`);
  const repoInfo = await fetchInfo.json();
  console.log(repoInfo);
  const fetchLanguages = await fetch (`https://api.github.com/repos/${username}/${repoName}/languages`);
  const languageData = await fetchLanguages.json();
  // console.log(languageData);
  const languages = [];
  for (const language in languageData){
    languages.push(language);
  }
  // console.log(languages);
  displayRepoInfo(repoInfo,languages);
};

const displayRepoInfo = function (repoInfo, languages){
  repoSection.classList.add("hide");
  repoDataSection.classList.remove("hide");
  repoDataSection.innerHTML = "";

  const dataSection = document.createElement ("div");
  dataSection.classList.add("repo-data");
  dataSection.innerHTML = `
    <h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
  `;
  repoDataSection.append(dataSection);
  backButton.classList.remove("hide");
};

// Back button and Search input (e is used for event)
viewReposButton.addEventListener("click", function(){
  repoSection.classList.remove("hide");
  repoDataSection.classList.add("hide");
  viewReposButton.classList.add("hide");
});

filterInput.addEventListener("input", function(e){
  const searchText = e.target.value;
  const repos = document.querySelectorAll(".repo");
  const lowerCaseSearchText = searchText.toLowerCase();

  for (const gitRepoName of repos){
    const lowerCaseRepoText = gitRepoName.innerText.toLowerCase();
    if (lowerCaseRepoText.includes(lowerCaseSearchText)) {
      gitRepoName.classList.remove("hide")
    } else {
      gitRepoName.classList.add("hide")
    }
  }
});




