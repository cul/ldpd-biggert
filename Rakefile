# load wax_tasks
spec = Gem::Specification.find_by_name 'wax_tasks'
Dir.glob("#{spec.gem_dir}/lib/tasks/*.rake").each {|r| load r}

# load biggert tasks
Dir.glob("_lib/tasks/*.rake").each {|r| load r}
