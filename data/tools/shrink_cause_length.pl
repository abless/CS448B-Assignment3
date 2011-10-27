#!/usr/bin/perl

$line = <STDIN>;
print $line;

my %causes = ();
my @rows = ();

while(<STDIN>)
{
    chomp;
    @line = split(/,/, $_);
    $line[3] =~ s/-/ to /;
    print $line[0].",".substr($line[1], 0, 3).",".$line[2].",".$line[3].",".$line[4]."\n";
    #push @rows, [@line];
}

exit;

@result = sort {$b->[1] <=> $a->[1] } @rows;

#print $result[0][0];
foreach ( @rows)
{
    print $_[0]."\n";
}
