(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        function addImage() {

            const data = JSON.parse(this.responseText);
            const firstImage = data.results[0];

            if (data && data.results && data.results[0]) {
                htmlContent = `<figure>
                            <img src = "${firstImage.urls.regular}" alt="${searchedForText}">
                            <figCaption>${searchedForText} by ${firstImage.user.name} </figCaption>
                            </figure>`

                responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
            }
            else {
                htmlContent = `<div class="error-no-image"> No images available</div>`;
            }
        }        

        const unsplashRequest = new XMLHttpRequest();
        unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        unsplashRequest.onload = addImage;
        unsplashRequest.onerror = function (err) {
            requestError(err,'image');
        };
        unsplashRequest.setRequestHeader('Authorization', 'Client-ID ee22818b237e8ed5820eb004e27e73a4970e5048878a822133124f518f6d9f21');

        unsplashRequest.send()

        function addArticles () {
            const data = JSON.parse(this.responseText);

            if (data && data.response && data.response.docs && data.response.docs.length>0) {
                htmlContent = `<ul>` + 
                                data.response.docs.map(article=>`<li class="article">
                                                                    <h2> <a href="${article.web_url}">${article.headline.main}</a></h2>
                                                                    <p>${article.snippet}</p>
                                 </li>`).join('') + '</ul>';                                                
            }
            else {
                htmlContent = `<div class="error-no-articles"> No articles available</div>`;
            }        

            responseContainer.insertAdjacentHTML('beforeend', htmlContent);
        }

        const articleRequest = new XMLHttpRequest();
        articleRequest.onload = addArticles;        
        articleRequest.onerror = function (err) {
            requestError(err,'articles');
        };        
        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=1e7b5fd4b2b84186abeaf664c38d6666`);
        articleRequest.send();
    });

})();



// unsplash Application ID ee22818b237e8ed5820eb004e27e73a4970e5048878a822133124f518f6d9f21
// Article Search API: 1e7b5fd4b2b84186abeaf664c38d6666