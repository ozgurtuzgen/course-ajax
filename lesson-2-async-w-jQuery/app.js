/* eslint-env jquery */

(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        function addImage(images) {            
            const firstImage = images.results[0];

            if (firstImage) {
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

        $.ajax({
            url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
            headers: {
                Authorization: 'Client-ID ee22818b237e8ed5820eb004e27e73a4970e5048878a822133124f518f6d9f21'
            }
        }).done(addImage);        


        function addArticles (data) {            

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

        $.ajax({
            url: `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=1e7b5fd4b2b84186abeaf664c38d6666`
        }).done(addArticles);
        
    });
})();
