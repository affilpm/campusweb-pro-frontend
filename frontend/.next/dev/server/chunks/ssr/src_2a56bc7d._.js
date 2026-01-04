module.exports = [
"[project]/src/lib/seo-api.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -- SEO Helper --
__turbopack_context__.s([
    "getPageSEO",
    ()=>getPageSEO
]);
const getPageSEO = async (slug)=>{
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        // Using native fetch for Better Next.js caching support
        const res = await fetch(`${apiUrl}/api/public/seo/${slug}/`, {
            next: {
                revalidate: 60
            }
        });
        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error(`Failed to fetch SEO for ${slug}`);
        }
        return res.json();
    } catch (error) {
        console.error(`Error fetching SEO for ${slug}:`, error);
        return null;
    }
};
}),
"[project]/src/app/contact/layout.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ContactLayout,
    "generateMetadata",
    ()=>generateMetadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$seo$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/seo-api.ts [app-rsc] (ecmascript)");
;
;
async function generateMetadata() {
    const seo = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$seo$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPageSEO"])('contact');
    if (seo) {
        return {
            title: seo.title || 'Contact Us | School',
            description: seo.meta_description || 'Get in touch with us. Find our address, phone number, email, and office hours. Send us a message for any inquiries about admissions, academics, or general information.',
            keywords: seo.meta_keywords ? seo.meta_keywords.split(',').map((k)=>k.trim()) : [
                'contact school',
                'school address',
                'school phone',
                'school email',
                'admissions inquiry'
            ],
            openGraph: {
                title: seo.title || 'Contact Us | School',
                description: seo.meta_description,
                images: seo.og_image ? [
                    seo.og_image
                ] : undefined,
                type: 'website'
            }
        };
    }
    return {
        title: 'Contact Us | School',
        description: 'Get in touch with us. Find our address, phone number, email, and office hours. Send us a message for any inquiries about admissions, academics, or general information.',
        keywords: [
            'contact school',
            'school address',
            'school phone',
            'school email',
            'admissions inquiry'
        ],
        openGraph: {
            title: 'Contact Us | School',
            description: 'Get in touch with us for any inquiries about admissions, academics, or general information.',
            type: 'website'
        }
    };
}
function ContactLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
}),
];

//# sourceMappingURL=src_2a56bc7d._.js.map