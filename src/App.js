import github from "./db.js";
import githubQuery from "./Query.js";
import RepoInfo from "./RepoInfo.js";
import query from "./Query.js"
import SearchBox from "./searchBox.js";
import NavButtons from "./NavButton.js";
import { useEffect, useState, useCallback } from "react";
function App(){
  let [UserName, setUserName] = useState("");
  let [repoList, setRepoList] = useState(null);
  let [pageCount, setPageCount] = useState(10);
  let [queryString, setQueryString] = useState("voice");
  let [totalCount, setTotalCount] = useState(null);

  let [startCursor, setStartCursor] = useState(null);
  let [endCursor, setendCursor] = useState(null);
  let [hasPreviousPage, sethasPreviousPage] = useState(false);
  let [hasNextPage, sethasNextPage] = useState(true);
  let [paginationKeyword, setpaginationKeyword] = useState("first");
  let [paginationString, setpaginationString] = useState("");

  const fetchData = useCallback(()=>{
    const queryText = JSON.stringify(query(pageCount,queryString,paginationKeyword,paginationString));
    fetch(github.baseURL, {
      method:"POST",
      headers: github.headers,
      body:queryText,
    })
    .then((response) => response.json())
    .then((data)=>{
      const viewer = data.data.viewer;
      const repos = data.data.search.edges;
      const total = data.data.search.repositoryCount;
      const start = data.data.search.pageInfo?.startCursor;
      const end = data.data.search.pageInfo?.endCursor;
      const next = data.data.search.pageInfo?.hasNextPage;
      const prev = data.data.search.pageInfo?.hasPreviousPage;
      
      setUserName(viewer.name);
      setRepoList(repos);
      setTotalCount(total);
      setStartCursor(start);
      setendCursor(end);
      sethasNextPage(next);
      sethasPreviousPage(prev);
    })
    .catch(err=>{
      console.log(err)
    })
  }, [pageCount, queryString, paginationKeyword,paginationString])
  useEffect(()=>{
    fetchData();
  }, [fetchData]);
  return <div className="App container mt-5">
  <h1 className="text-primarily"><i className="bi bi-diagram-2-fill">Repos</i></h1>
  <p>Hey there {UserName}</p>
  <SearchBox
  totalCount={totalCount}
  pageCount={pageCount}
  queryString={queryString}
  onTotalChange={(myNumber)=>{setPageCount(myNumber)}}
  onQueryChange={(myString)=>{setQueryString(myString)}}
/>
<NavButtons
start={startCursor}
end={endCursor}
next={hasNextPage}
previous={hasPreviousPage}
onpage={(mykeyword, myString)=>{
  setpaginationKeyword(mykeyword);
  setpaginationString(myString);
}}
/>

  <p>
    <b>Search for:</b> {queryString} | <b>Items per page:</b> {pageCount} |<b>Total results:</b> {totalCount}
  </p>
  {
    repoList &&(
      <ul className="list-group list-group-flush">
        {
          repoList.map((repo)=>(
            <RepoInfo key={repo.node.id} repo={repo.node} />
    ))}
      </ul>
    )
  }
  </div>
}
export default App;