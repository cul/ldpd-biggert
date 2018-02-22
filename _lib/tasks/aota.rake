desc "'all of the above' collection processing (pages/markers/index)"
task :aota do
  Rake::Task['wax:config'].invoke
  $argv = ['biggert']
  Rake::Task['iiif_collect'].invoke
  Rake::Task['wax:pagemaster'].invoke
  Rake::Task['markers'].invoke
  Rake::Task['wax:lunr'].invoke
end
