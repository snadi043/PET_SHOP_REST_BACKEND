const deleteProduct = (btn) => {
    const productId = btn.parentElement.querySelector('[name=productId]').value;
    const productElement = btn.closest('article');
    
    fetch('/admin/products/' + productId, {
        method: 'DELETE',
        headers: {}
    }).then(result => {
        return result.json();
    }).then(data => {
        productElement.parentNode.removeChild(productElement);
        console.log(result);
    })
    .catch(err => {
        console.log(err);
    })
}