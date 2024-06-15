set table "temp_tikz.pgf-plot.table"; set format "%.5f"
set format "%.7e";; unset surface; set cntrparam levels incr -50,10,50; set isosamples 500; set contour; splot x**2+y**2+x*y; 
