import fs from "fs";
import path from "path";
import matter from "gray-matter";
import lunr from "lunr";

console.info(`- Generating Lunr search index`);

const root = process.cwd();
//   const prettierConfig = await prettier.resolveConfig("./.prettierrc");

const typeToPath = {
  blog: "content",
};

function getPosts(type) {
  const files = fs.readdirSync(path.join(root, typeToPath[type])).filter((name) => name !== "img");

  const posts = files
    .reduce((allPosts, postSlug) => {
      const source = fs.readFileSync(path.join(root, typeToPath[type], postSlug), "utf8");
      const {data} = matter(source);

      return [
        {
          ...data,
          slug: postSlug.replace(".mdx", ""),
        },
        ...allPosts,
      ];
    }, [])
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

const documents = [...getPosts("blog")];

const index = lunr(function () {
  this.field("title");
  this.field("subtitle");
  this.field("keywords");
  this.field("type");
  this.ref("slug");

  documents.forEach(function (doc) {
    this.add(doc);
  }, this);
});

const store = documents.reduce((acc, {slug, subtitle, title, type}) => {
  acc[slug] = {title, subtitle, slug, type};
  return acc;
}, {});

try {
  fs.readdirSync("cache");
} catch (error) {
  console.error(`- An error occurred while generating the Lunr search index `);
  console.error(error);
  fs.mkdirSync("cache");
}

fs.writeFile("cache/search.json", JSON.stringify({index, store}), (error) => {
  if (error) {
    return console.error(error);
  }
});
