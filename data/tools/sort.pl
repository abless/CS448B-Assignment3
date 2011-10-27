#!/usr/bin/perl

$line = <STDIN>;
print $line;

my %causes = ();
my @rows = ();

while(<STDIN>)
{
    chomp;
    @line = split(/,/, $_);
    push @rows, [@line];
}

@result = sort {$b->[4] <=> $a->[4] } @rows;

foreach ( @result)
{
    print $_->[1]." ".$_->[4]."\n";
}
