<?php

/*
|--------------------------------------------------------------------------
| Site Content
|--------------------------------------------------------------------------
|
| Business content for the All Seasons Landscape Maintenance one-page site.
| Every fact here comes from the client's existing website (aslm.us).
| Do not add services, numbers or testimonials that the client has not provided.
|
*/

return [

    'name' => 'All Seasons Landscape Maintenance',

    'short_name' => 'All Seasons',

    'tagline' => 'See what we can do for you.',

    'description' => 'All Seasons Landscape Maintenance has cared for lawns and grounds in Eugene, Oregon for over 20 years. Aerating, hedge trimming, mulching, sod installation, clean-ups and hauling, with quality results at an affordable price.',

    'years' => '20+',

    'location' => 'Eugene, Oregon',

    'phone' => [
        'display' => '541-579-4393',
        'href' => 'tel:+15415794393',
    ],

    'address' => [
        'line1' => 'PO Box 40132',
        'line2' => 'Eugene, OR 97404',
    ],

    'map_url' => 'https://www.google.com/maps/search/?api=1&query=Eugene%2C+OR+97404',

    /*
    | Service groups, as listed on the current site.
    | "scene" is a key the 3D scene uses to pick a visual beat for each item.
    */
    'service_groups' => [
        [
            'title' => 'Lawn & Grounds Maintenance',
            'season' => 'green',
            'items' => [
                ['name' => 'Aerating', 'scene' => 'aerate', 'copy' => 'Opening up compacted soil so air, water and nutrients reach the roots.'],
                ['name' => 'Hedge Trimming', 'scene' => 'trim', 'copy' => 'Clean, even lines that keep hedges healthy and the property sharp.'],
                ['name' => 'Mulching', 'scene' => 'mulch', 'copy' => 'Fresh mulch to hold moisture, calm weeds and finish every bed.'],
                ['name' => 'Topdressing', 'scene' => 'topdress', 'copy' => 'A fine layer of quality material to level and feed the lawn.'],
                ['name' => 'Overseeding', 'scene' => 'overseed', 'copy' => 'Filling thin patches for a thicker, greener lawn.'],
            ],
        ],
        [
            'title' => 'Clean Up & Hauling Service',
            'season' => 'gold',
            'items' => [
                ['name' => 'Yard Clean-Ups', 'scene' => 'cleanup', 'copy' => 'Leaves, branches and overgrowth cleared, leaving the yard ready to enjoy.'],
                ['name' => 'New Lawns & Sod Installation', 'scene' => 'sod', 'copy' => 'New lawns laid right, from bare ground to green.'],
                ['name' => 'Gravel Driveways', 'scene' => 'gravel', 'copy' => 'Gravel driveway maintenance and installation.'],
                ['name' => 'Yard Overhauls', 'scene' => 'overhaul', 'copy' => 'Bringing a tired yard back to life, top to bottom.'],
                ['name' => 'Hauling Yard Debris', 'scene' => 'haul', 'copy' => 'Yard debris loaded up and hauled away.'],
            ],
        ],
    ],

    /*
    | The three claims the current site makes about the business.
    */
    'highlights' => [
        ['value' => '20+', 'label' => 'Years in Eugene', 'copy' => 'Over two decades caring for lawns and grounds across the Eugene area.'],
        ['value' => 'Quality', 'label' => 'Results first', 'copy' => 'More than ordinary landscapers. Every job is finished to a standard we are proud of.'],
        ['value' => 'Fair', 'label' => 'Affordable pricing', 'copy' => 'Quality work at a price that makes sense, season after season.'],
    ],

    /*
    | Project photos from the client's existing gallery (public/images/gallery).
    */
    'gallery' => [
        ['file' => '9.jpg', 'alt' => 'Freshly striped lawn sweeping up to a two-story home framed by autumn trees'],
        ['file' => '22.jpg', 'alt' => 'Circular driveway garden with a tiered fountain, boxwood hedges and orange flowers'],
        ['file' => '7.jpg', 'alt' => 'Stone waterfall cascading over boulders into a river-rock stream bed'],
        ['file' => '19.jpg', 'alt' => 'Wide manicured front lawn in front of a home with a green roof'],
        ['file' => '13.jpg', 'alt' => 'Curving lawn edge beside a wooden porch with ornamental grasses'],
        ['file' => '18.jpg', 'alt' => 'Lawn and curved paved driveway among tall pine trees'],
        ['file' => '8.jpg', 'alt' => 'Garden pond with stepping-stone edging beside a home'],
        ['file' => '23.jpg', 'alt' => 'Rounded shrubs and red autumn foliage along a front walkway'],
        ['file' => '21.jpg', 'alt' => 'Large striped lawn bordered by mulch beds and pine forest'],
        ['file' => '14.jpg', 'alt' => 'Stone bubbler fountain set in river rock beside a front entry'],
        ['file' => '15.jpg', 'alt' => 'Open lawn meeting a line of trees in yellow and orange fall color'],
        ['file' => '24.jpg', 'alt' => 'Tree with golden leaves ringed by fresh mulch on a green lawn'],
        ['file' => '6.jpg', 'alt' => 'Curved lawn with crisp bark-mulch edging under a large oak'],
        ['file' => '17.jpg', 'alt' => 'Boulder and river-rock garden bed among pine trees'],
        ['file' => '12.jpg', 'alt' => 'Lawn curving around a deck and shrub beds under a blue sky'],
        ['file' => '20.jpg', 'alt' => 'Striped lawn edge meeting a stamped concrete patio'],
        ['file' => '11.jpg', 'alt' => 'Fountain grass plumes along the edge of a lush lawn'],
        ['file' => '16.jpg', 'alt' => 'Lawn edge curving beneath an oak with fall trees beyond'],
        ['file' => '10.jpg', 'alt' => 'Close view of a thick, evenly mowed lawn'],
    ],

];
