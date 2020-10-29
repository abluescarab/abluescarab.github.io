### Modified from http://mrloh.se/2015/06/automatic-archives-for-jekyll-on-github-pages/

def write_template(path, permalink, title, options={})
    File.open(path, 'w') do |f|
        f.puts "---"
        f.puts "layout: blog"
        f.puts "title: #{title}"
        f.puts "permalink: #{permalink}"

        options.each do |k, v|
            f.puts "#{k}: \"#{v}\""
        end

        f.puts "---"
    end
    puts "created archive page for #{title}"
end

def read_values(path)
    values = []
    File.open(path, 'r') do |f|
        while line = f.gets
            line = line.strip
            values += [line] unless line == "" || line == "\n"
        end
    end
    values
end

def create_folder(relative_path)
    path = File.expand_path(relative_path, __FILE__)
    Dir.mkdir(path) unless File.exists?(path)
    path
end

# Create containing folders
tags_folder_path = create_folder("../tag/")
categories_folder_path = create_folder("../category/")

# Read tags
tags_path = File.expand_path("../../_site/blog/tags.txt", __FILE__)
tags = read_values(tags_path)

# Read categories
categories_path = File.expand_path("../../_site/blog/categories.txt", __FILE__)
categories = read_values(categories_path)

# Create template files for tags
for tag in tags
    tagpage_path = tags_folder_path + "/#{tag}.md"
    write_template(tagpage_path, "blog/tag/#{tag}/", tag, {"list_title": "Posts tagged " + tag, "tags": tag})
end

# Create template files for categories
for category in categories
    categorypage_path = categories_folder_path + "/#{category}.md"
    write_template(categorypage_path, "blog/category/#{category}/", category, {"list_title": "Posts in " + category, "categories": category})
end
