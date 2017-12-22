(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
            headers: {
                Authorization: 'Client-ID ee22818b237e8ed5820eb004e27e73a4970e5048878a822133124f518f6d9f21'
            }
        }).then(function (response) {
            return response.json();
        })
            .then(addImage)
            .catch(e => requestError(e, 'image'));

        function addImage(data) {
            // throw new Error('Hede');
            const firstImage = data.results[0];

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

        function requestError(e, part) {
            console.log(e);
            responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
        }


        fetch(`http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=1e7b5fd4b2b84186abeaf664c38d6666`)
            .then(function (response) {
                return response.json();
            })
            .then(addArticles)
            .catch(e => requestError(e, 'article'));

        function addArticles(data) {
            //throw new Error('Hede');
            if (data && data.response && data.response.docs && data.response.docs.length > 0) {
                htmlContent = `<ul>` +
                    data.response.docs.map(article => `<li class="article">
                                                                    <h2> <a href="${article.web_url}">${article.headline.main}</a></h2>
                                                                    <p>${article.snippet}</p>
                                 </li>`).join('') + '</ul>';
            }
            else {
                htmlContent = `<div class="error-no-articles"> No articles available</div>`;
            }

            responseContainer.insertAdjacentHTML('beforeend', htmlContent);
        }
    });
})();
