$(document).ready(function () {
//LAZYLOADING
if ($.fn.lazyLoad) {
    var paging = $('.lazyloading-paging');
    if (!paging.length) {
        return;
    }

    var times = parseInt(paging.data('times'), 10);
    var link_text = paging.data('linkText') || 'Load more';
    var loading_str = paging.data('loading-str') || 'Loading...';

    // check need to initialize lazy-loading
    var current = paging.find('li.selected');
    if (current.children('a').text() != '1') {
        return;
    }
    paging.hide();
    var win = $(window);

    // prevent previous launched lazy-loading
    win.lazyLoad('stop');

    // check need to initialize lazy-loading
    var next = current.next();
    if (next.length) {
        win.lazyLoad({
            container: '.products',
            load: function () {
                win.lazyLoad('sleep');

                var paging = $('.lazyloading-paging').hide();

                // determine actual current and next item for getting actual url
                var current = paging.find('li.selected');
                var next = current.next();
                var url = next.find('a').attr('href');
                if (!url) {
                    win.lazyLoad('stop');
                    return;
                }

                var product_list = $('.products');
                var loading = paging.parent().find('.loading').parent();
                if (!loading.length) {
                    loading = $('<div><i class="icon16 loading"></i>'+loading_str+'</div>').insertBefore(paging);
                }

                loading.show();
                $.get(url, function (html) {
                    var tmp = $('<div></div>').html(html);
                    if ($.Retina) {
                        tmp.find('.products img').retina();
                    }
                    product_list.append(tmp.find('.products').children());
                    var tmp_paging = tmp.find('.lazyloading-paging').hide();
                    paging.replaceWith(tmp_paging);
                    paging = tmp_paging;

                    times -= 1;

                    // check need to stop lazy-loading
                    var current = paging.find('li.selected');
                    var next = current.next();
                    if (next.length) {
                        if (!isNaN(times) && times <= 0) {
                            win.lazyLoad('sleep');
                            if (!$('.lazyloading-load-more').length) {
                                $('<a href="#" class="lazyloading-load-more">' + link_text + '</a>').insertAfter(paging)
                                    .click(function () {
                                        loading.show();
                                        times = 1;      // one more time
                                        win.lazyLoad('wake');
                                        win.lazyLoad('force');
                                        return false;
                                    });
                            }
                        } else {
                            win.lazyLoad('wake');
                        }
                    } else {
                        win.lazyLoad('stop');
                        $('.lazyloading-load-more').hide();
                    }

                    loading.hide();
                    tmp.remove();
                });
            }
        });
    }
}
});