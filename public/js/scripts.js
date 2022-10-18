
// SideBar Start
let sideBar = document.getElementById('sideBar');
let sideBarNav = document.getElementById('sideBarNav');
let sideBarBtn = document.getElementById('sideBarBtn');

sideBarBtn.addEventListener('click', e => {
  e.preventDefault();
  sideBarNav.classList.toggle('close');
  sideBar.classList.toggle('close');
});

// SideBar End


// $.fn.WBslider = function () {
//   return this.each(function () {
//     var $_this = $(this),
//       $_input = $('input', $_this),
//       $_current_value = $('.current-value', $_this),
//       $_min_value = $('.min-value', $_this).text(),
//       $_max_value = $('.max-value', $_this).text(),
//       thumbwidth = 50; // set this to the pixel width of the thumb

//     // set range max to current year
//     $_input.attr('max', $_max_value);
//     $('.max-value', $_this).text($_max_value);
//     //$_input.val($_max_value - 10);

//     $_input.on('input change keyup', function () {
//       var $_this = $(this),
//         val = parseInt($_input.val(), 10);

//       if (val < 30) {
//         val = '< 31';
//       }
//       if (val === '') { // Stop IE8 displaying NaN
//         val = 0;
//       }

//       $_current_value.text(val);

//       var pos = (val - $_input.attr('min')) / ($_input.attr('max') - $_input.attr('min'));

//       // position the title with the thumb
//       var thumbCorrect = thumbwidth * (pos - 0.5) * -1,
//         titlepos = Math.round((pos * $_input.width()) - thumbwidth / 4 + thumbCorrect);

//       $_current_value.css({ 'left': titlepos });

//       // show "progress" on the track
//       pos = Math.round(pos * 99); // to hide stuff behide the thumb
//       var grad = 'linear-gradient(90deg, #A7A7A7 ' + pos + '%,#dad9d5 ' + (pos + 1) + '%)';
//       $_input.css({ 'background': grad });

//     }).on('focus', function () {
//       if (isNaN($(this).val())) {
//         $(this).val(0);
//       }
//     }).trigger('change');

//     $(window).on('resize', function () {
//       $_input.trigger('change');
//     });
//   });
// };

// $(function () {

//   $('.slider').WBslider();

// });